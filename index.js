import { promises as fs } from 'fs';

let estadosGlobal = [];

async function criarEstados() {
  try {
    const estados = JSON.parse(await fs.readFile('./data/Estados.json'));
    const cidades = JSON.parse(await fs.readFile('./data/Cidades.json'));
    for (const estado of estados) {
      const siglaDoEstado = estado.Sigla;
      const cidadesDesteEstado = [];
      await cidades.map((cidade) => {
        if (cidade.Estado === estado.ID) {
          cidadesDesteEstado.push(cidade);
        }
      });
      await fs.writeFile(
        `./estados/${siglaDoEstado}.json`,
        JSON.stringify(cidadesDesteEstado)
      );
    }
    estadosGlobal = estados;
  } catch (err) {
    console.log(err);
  }
}

async function contarCidades(UF) {
  try {
    console.log(`Número de Cidades em ${UF}:`);
    const contagemDeCidades = JSON.parse(
      await fs.readFile(`./estados/${UF}.json`)
    ).length;
    console.log(contagemDeCidades);
    return contagemDeCidades;
  } catch (err) {
    console.log(err);
  }
}

async function estadosComMaisCidades(numeroDeEstados) {
  try {
    const estados = estadosGlobal;
    for (const estado of estados) {
      estado.numeroDeCidades = await contarCidades(estado.Sigla);
    }
    estados.sort((a, b) => {
      return b.numeroDeCidades - a.numeroDeCidades;
    });
    const estadosComMaisCidades = [];
    const estadosComMenosCidades = [];
    for (let i = 0; i < numeroDeEstados; i++) {
      estadosComMaisCidades.push(
        `${estados[i].Sigla} - ${estados[i].numeroDeCidades}`
      );
      estadosComMenosCidades.push(
        `${estados[estados.length - numeroDeEstados + i].Sigla} - ${
          estados[estados.length - numeroDeEstados + i].numeroDeCidades
        }`
      );
    }
    console.log(`${numeroDeEstados} estados com mais cidades:`);
    console.log(estadosComMaisCidades);
    console.log(`${numeroDeEstados} estados com menos cidades:`);
    console.log(estadosComMenosCidades);
  } catch (err) {
    console.log(err);
  }
}

async function cidadeMaiorNome(UF) {
  try {
    const cidadesDesteEstado = JSON.parse(
      await fs.readFile(`./estados/${UF}.json`)
    );
    await cidadesDesteEstado.sort((a, b) => {
      return b.Nome.length < a.Nome.length
        ? -1
        : a.Nome.length > b.Nome.length
        ? 1
        : a.Nome < b.Nome
        ? -1
        : 1;
    });
    //console.log(cidadesDesteEstado);
    return `${cidadesDesteEstado[0].Nome} - ${UF};`;
  } catch (err) {
    console.log(err);
  }
}

async function cidadeMenorNome(UF) {
  try {
    const cidadesDesteEstado = JSON.parse(
      await fs.readFile(`./estados/${UF}.json`)
    );
    await cidadesDesteEstado.sort((a, b) => {
      return a.Nome.length < b.Nome.length
        ? -1
        : a.Nome.length > b.Nome.length
        ? 1
        : a.Nome < b.Nome
        ? -1
        : 1;
    });
    return `${cidadesDesteEstado[0].Nome} - ${UF};`;
  } catch (err) {
    console.log(err);
  }
}

async function cidadesMaiorMenorNome() {
  const cidadesMaiorNome = [];
  for (const estado of estadosGlobal) {
    cidadesMaiorNome.push(await cidadeMaiorNome(estado.Sigla));
  }
  cidadesMaiorNome.sort((a, b) => {
    return a.length < b.length ? -1 : a.length > b.length ? 1 : a < b ? -1 : 1;
  });
  console.log('Cidades com maior nome:');
  console.log(cidadesMaiorNome);

  const cidadesMenorNome = [];
  for (const estado of estadosGlobal) {
    cidadesMenorNome.push(await cidadeMenorNome(estado.Sigla));
  }
  cidadesMenorNome.sort((a, b) => {
    return a.length < b.length ? -1 : a.length > b.length ? 1 : a < b ? -1 : 1;
  });
  console.log('Cidades com menor nome:');
  console.log(cidadesMenorNome);
}

(async () => {
  await criarEstados();
  await contarCidades('SP');
  await estadosComMaisCidades(5);
  await cidadesMaiorMenorNome();
})();
