import React, { useState } from "react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";   
import Input from "../components/ui/Input";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header"; 
import HoraryAIChat from "./HoraryAIChat";

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

            <main><HoraryAIChat /></main>
            </div>
        </div>
    )
}