<template>
    <div class = "home-container">
        <div class = "pagina">
            <h1>Bem-vindo à Home!</h1>
            <p>Esta é a página inicial do seu aplicativo.</p>

            <div class = "bottoes">
                <h1>Registro</h1>
                <button class = "botao um" @click="$router.push('/register')">
                    Registrar
                </button>

                <h1>Login</h1>
                <button class = "botao dois" @click="$router.push('/login')">
                    Fazer Login
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.home-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #4facfe, #00f2fe);
  font-family: Arial, Helvetica, sans-serif;
  min-height: 100vh;
}

.pagina {
  background: white;
  padding: 40px;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 10px 25px rgba(0,0,0,0.15);
  width: 350px;
}

h1 {
  margin-bottom: 10px;
}

p {
  color: #555;
  margin-bottom: 25px;
}

.bottoes {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.botao {
  padding: 12px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  transition: 0.2s;
}

.botao.um {
  background-color: #4facfe;
  color: white;
}

.botao.dois {
  background-color: #d6ceceb7;
}

</style>