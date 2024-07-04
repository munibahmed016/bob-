import React from 'react';
import ChatBot from "./components/ChatBot";

function App() {
    return (
        <div className="App">
            <header className="App-header">
                <div style={{ display: "flex", justifyContent: "center", 
                    alignItems: "center", marginTop: `calc(20vh)` }}>
                    <ChatBot
                        options={{
                            audio: { disabled: false },
                            chatInput: { botDelay: 1000 },
                            userBubble: { showAvatar: true },
                            botBubble: { showAvatar: true },
                            voice: { disabled: false }
                        }}
                    ></ChatBot>
                </div>
            </header>
        </div>
    );
}

export default App;
