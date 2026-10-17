import { useState } from "react";
import "./App.css";
import Login from "./pages/Login";

function App() {
  const [showLogin, setShowLogin] = useState(false);

  if (showLogin) {
    return <Login />;
  }

  return (
    <main className="sentrix-page">
      <section className="sentrix-card">
        <div className="sentrix-logo">
          SENTRIX
        </div>

        <h1>
          A segurança do seu veículo,
          <br />
          sempre consigo.
        </h1>

        <p>
          Sistema inteligente de segurança automóvel.
        </p>

        <button
          className="login-button"
          onClick={() => setShowLogin(true)}
        >
          Entrar
        </button>
      </section>
    </main>
  );
}

export default App;