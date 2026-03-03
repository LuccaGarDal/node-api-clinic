export const getCepData = async (cep) => {
    const cleanCep = cep.replace(/\D/g, "");

    const response = await fetch(
        `https://viacep.com.br/ws/${cleanCep}/json/`
    );

    const data = await response.json();

    if (data.erro) {
        throw new Error("CEP não encontrado");
    }

    return data;
};