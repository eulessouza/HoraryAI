import React, { useState } from "react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";   
import Input from "../components/ui/Input";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";   

export default function Home() {
    const [name, setName] = useState("");
    const [planet, setPlanet] = useState("");

    return (
        <div className="home">

            <Header style={{ backgroundColor: '#f0f0f0', padding: '10px' }} />
            <div>
                <Sidebar style={{ width: '200px', backgroundColor: '#e0e0e0', padding: '10px' }}>
                <p>Sidebar content</p>
            </Sidebar>

            <main>
                <Card style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
                <h2>Seja bem-vindo!</h2>
                <Input 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    placeholder="Digite seu nome" 
                />
                <Button onClick={() => alert(`Olá, ${name}!`)}>Enviar</Button>
                </Card>

                <Card>
                    <h2>Gerar posição planetaria</h2>
                    <Input 
                        value={planet}
                        onChange={(e) => setPlanet(e.target.value)}
                        placeholder="Digite o planeta" 
                    />
                    <Button onClick={() => alert(`Planeta selecionado ${planet}`)}>Gerar</Button>
                </Card>

                <Card>
                    <h2>Resultados</h2>
                    <p>Aqui aparecerão as posições planetarias</p>
                </Card>
            </main>
            </div>
            
        </div>
    )
}