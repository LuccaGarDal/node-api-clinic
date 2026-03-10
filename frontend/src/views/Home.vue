<template>
    <div>
        <h1>Bem-vindo à Home!</h1>
        <p>Esta é a página inicial do seu aplicativo.</p>
        <h1>Registro</h1>
        <button @click="$router.push('/register')">Registrar</button>
        <h1>Login</h1>
        <button @click="$router.push('/login')">Fazer Login</button>
    </div>
</template>