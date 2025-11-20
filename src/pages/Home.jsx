import React from "react";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header"; 
import HoraryAIChat from "./HoraryAIChat";
import PlanetInfo from "../components/PlanetInfo";

export default function Home() {
    return (
        <div className="home">

            <Header style={{ backgroundColor: '#f0f0f0', padding: '10px' }} />
            <div>
                <Sidebar style={{ width: '300px', padding: '10px' }}>
                <h2>Menu</h2>
                <ul>
                    <li>Início</li>
                    <li>Posições Planetárias</li>
                    <li>Configurações</li>
                </ul>       
            </Sidebar>

            <main>
                <HoraryAIChat />
                <PlanetInfo date={"2025-11-20"} planetId={0} />
            </main>
            </div>
        </div>
    )
}
