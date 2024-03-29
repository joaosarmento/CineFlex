import { useState, useEffect } from "react";
import axios from "axios";
import { useParams,useNavigate } from "react-router-dom";
import styled from "styled-components";

import Footer from "../Footer";

function Session(){
    const {sessionId} = useParams();
    const [session, setSession] = useState(null);
    const [name, setName] = useState('');
    const [CPF, setCPF] = useState('');
    const navigate = useNavigate();
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [selected,setSelected] = useState([]);

    console.log(selectedSeats);

    useEffect(()=>{
        const promise = axios.get(`https://mock-api.driven.com.br/api/v5/cineflex/showtimes/${sessionId}/seats`);
        promise.then(answer => setSession(answer.data));
    },[]);

    function reservar(event){
        event.preventDefault();
        const CPFModel = /^\d{3}\.\d{3}\.\d{3}\-\d{2}$/;
        const isCPF = CPFModel.test(CPF);
        if(!isCPF){
            alert('CPF nao existente, por favor digitar no formato 000.000.000-00');
        }else if(selectedSeats.length<1){
            alert('Nenhum assento selecionado!');
        }else{
            const data = {
                ids: selectedSeats,
                name: name,
                cpf: CPF
            };
            const promise = axios.post("https://mock-api.driven.com.br/api/v5/cineflex/seats/book-many", data);
            promise.then(()=>{
                console.log('conseguiu');
                navigate('/sucesso', { state: { name, CPF, session, selectedSeats} });
        })
        promise.catch(()=> alert('Erro na hora de enviar dados'))
    }
    }

    if(session===null||session.length<1) {
		return <h2>LOADING....</h2>;
	}else{
    return (
        <ChooseSeats>
            <h3>Selecione o(s) assento(s)</h3>
            <Seats>
                {session.seats.map((seat,index) => ShowSeats(seat, index, selectedSeats, setSelectedSeats, selected,setSelected))}
            <Captions>
                <Caption color='#8DD7CF' borderColor='#1AAE9E'><div></div><p>Selecionado</p></Caption>
                <Caption color='#C3CFD9' borderColor='#7B8B99'><div></div><p>Disponível</p></Caption>
                <Caption color='#FBE192' borderColor='#F7C52B'><div></div><p>Indisponível</p></Caption>
            </Captions>
            </Seats>
            <p>Assentos selecionados: {selected.map(select => select + '  ')}</p>
            <form onSubmit={reservar}>
                <label htmlFor="campoNome">Nome do comprador:</label>
		        <input type="text" id="campoNome" placeholder="Digite seu nome..." value={name} onChange={e => setName(e.target.value)} required/>
                <label htmlFor="campoCPF">CPF do comprador:</label>
		        <input type="text" id="campoCPF" placeholder="Digite seu CPF..." value={CPF} onChange={e => setCPF(e.target.value) } required/>
		        <button type="submit">Reservar assento(s)</button>
		    </form>
            <Footer title={session.movie.title} poster={session.movie.posterURL} weekday={session.day.weekday} name={session.name}/>
        </ChooseSeats>
    )}
}
function ShowSeats(seat,index, selectedSeats, setSelectedSeats, selected,setSelected){
    let color;
    let borderColor;
    // let selected = false;

    function selectSeat(){
        const array = [...selectedSeats]
        const find = array.findIndex(element => element === seat.id);
        if(find>-1){
            setSelectedSeats(selectedSeats.filter(element => element!== seat.id));
            setSelected(selected.filter(element => element!== index));
        } else{
        setSelectedSeats([...selectedSeats, seat.id]);
        setSelected([...selected, index]);}
    }

    if(seat.isAvailable){
        if(selected){
            color='#C3CFD9';
            borderColor='#808F9D';
        }else{
            color='#8DD7CF';
            borderColor='#45BDB0';
        }
        
        return (
            <Seat onClick={() => selectSeat()} key={index} color={color} borderColor={borderColor}>{index}</Seat>
        )
    }
    
    return (
        <Seat key={index} color='#FBE192' borderColor='#F7C52B'>{index}</Seat>
    )
}



const ChooseSeats = styled.section`
    display:flex;
    flex-direction: column;
    margin-bottom: 130px;
    font-family: 'Roboto', sans-serif;
    align-items: center;
    box-sizing: border-box;

    h3{
        display: flex;
        align-itens: center;
        justify-content: center;
        font-size: 24px;
        padding: 40px 0 18px 0;
    }
    form{
        display: flex;
        flex-direction: column;
        width: 330px;
        font-size:18px;
        color:#293845;
        margin:22px;
    }
    p{
        margin: 10px;
    }
    form input{
        border: 1px solid #D5D5D5;
        width: 327px;
        height: 51px;
        font-size:18px;
        border-radius: 3px;
        margin: 3px 0 10px 0;
    }
    form button{
        background: #E8833A;
        border-radius: 3px;
        border: none;
        color: #FFFFFF;
        height: 42px;
        width: 225px;
        margin-left: 52px;
        margin-top: 30px;
        font-size: 18px;
        font-family: 'Roboto', sans-serif;
    }`

const Seats = styled.article`
    display: flex;
    width: 350px;
    flex-wrap: wrap;
    justify-content: center;
`

const Seat = styled.div`
    height: 26px;
    width: 26px;
    background:${props => props.color};
    border: 1px solid ${props => props.borderColor};
    border-radius: 13px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 9px 3.5px;
`

const Captions = styled.div`
    display:flex;
`

const Caption = styled.div`
    margin: 12px;
    display: flex;
    flex-direction: column;
    align-items: center;

    div{
        background:${props => props.color};
        height: 25px;
        width: 25px;
        border: 1px solid ${props => props.borderColor};
        border-radius:15px;
        margin: 6px;
    }
    p{
        color: #4E5A65;
    }
`


export default Session;