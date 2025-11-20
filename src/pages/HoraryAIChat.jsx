import React, { useState } from "react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";   
import Input from "../components/ui/Input";
import PlanetList from "../components/astrology/PlanetList";
import usePlanet from "../hooks/usePlanet";

export default function HoraryAIChat() {
    const [planets, setPlanets] = useState([]);
    const [search, setSearch] = useState("");

    const handleGeneratePosition = () => {
        if (search.trim() === "") {
            setPlanets(usePlanet()); // Load all planets if no search term is provided
        } else {
            const planet = usePlanet().find(
                (p) => p.name.toLowerCase() === search.trim().toLowerCase()
            );
            if (planet) setPlanets([planet]);
            else alert("Planet not found!");
        }
    };

    return (
        <div className="horary-ai-chat">
            
                
            <main>
                <Card>
                    <h2>Gerar posição planetaria</h2>
                    <Input 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)} 
                        placeholder="Digite o planeta" 
                    />
                    <Button onClick={handleGeneratePosition }>Gerar</Button>
                </Card>

                <Card>      
                    <h2>Resultado</h2>
                    <p>Aqui aparecerão as posições planetarias</p>
                </Card>
                <PlanetList planets={planets} />
            </main>
            </div>
        
    );
}