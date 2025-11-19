import React, { useState } from "react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";   
import Input from "../components/ui/Input";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header"; 
import PlanetPosition from "../components/astrology/PlanetPosition"; 
import { ephemerisData } from "../services/ephemeris"; 

export default function HoraryAIChat() {
    const [selectedPlanet, setSelectedPlanet] = useState(null);
    const [searchPlanet, setSearchPlanet] = useState("");

    const handleGeneratePosition = () => {
        const planet = ephemerisData.find(
            (p) => p.name.toLowerCase() === searchPlanet.toLowerCase()
        );
        if (planet) setSelectedPlanet(planet);
        else alert("Planeta não encontrado!");
    };

    return (
        <div className="horary-ai-chat">
            
                
            <main>
                <Card>
                    <h2>Gerar posição planetaria</h2>
                    <Input 
                        value={searchPlanet}
                        onChange={(e) => setSearchPlanet(e.target.value)}
                        placeholder="Digite o planeta" 
                    />
                    <Button onClick={handleGeneratePosition }>Gerar</Button>
                </Card>

                <Card>
                    <h2>Resultado</h2>
                    <p>Aqui aparecerão as posições planetarias</p>
                </Card>
                <PlanetPosition planet={selectedPlanet} />
            </main>
            </div>
        
    );
}