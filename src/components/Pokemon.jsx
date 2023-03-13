import _ from 'lodash';
import React from 'react';
import axios from 'axios';
import {
  POKEAPI_MOVE_URL,
  POKEAPI_POKEMON_URL
} from '../global/constants';

class Pokemon extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      pokemonName: '',
      pokemonSpriteUrl: '',
      pokemonTypes: [],
      pokemonMoves: [],
    };
  }

  loadRandomPokemonCard = async () => {
    this.setState({
      isLoading: true,
    });

    const randomPokemonId = Math.floor(Math.random() * 1008) + 1;
    const pokemon = (await axios.get(`${POKEAPI_POKEMON_URL}/${randomPokemonId}`)).data;
    const fourRandomPokemonMoves = [];
    const allPokemonMoves = pokemon.moves;
    while (fourRandomPokemonMoves.length < 4) {
      const randomMove = allPokemonMoves[Math.floor(Math.random() * allPokemonMoves.length)]
      if (!_.includes(fourRandomPokemonMoves, randomMove)) {
        fourRandomPokemonMoves.push(randomMove);
      }
    }

    const pokemonMoves = [];
    await Promise.all(_.map(fourRandomPokemonMoves, async randomPokemonMove => {
      const move = (await axios.get(`${POKEAPI_MOVE_URL}/${randomPokemonMove.move.name}/`)).data;
      pokemonMoves.push({
        names: move.names,
        power: move.power,
        type: move.type.name
      });
    }));
    
    this.setState({
      isLoading: false,
      pokemonName: pokemon.name,
      pokemonSpriteUrl: pokemon.sprites.front_default,
      pokemonTypes: pokemon.types.map(type => type.type.name),
      pokemonMoves: pokemonMoves,
    });
    console.log(this.pokemonTypes);
  }

  async componentDidMount() {
    await this.loadRandomPokemonCard();
  }

  getNameOfMovements = async (moves) => {
    const movesTranslate = [];
    for (const move of moves) {
      const { url } = move.move;
      const movementId = url.replace(this.baseUrl, "");
      const movementData = await this.getNameOfMove(movementId);

      if (movementData[0]) {
        const { names, id } = movementData[0];
        const nameSpanish = names.find((n) => n.language.name === "es");
        if (nameSpanish) {
          movesTranslate.push({ name: nameSpanish.name, id });
        }
      }

      if (movesTranslate.length === 5) {
        break;
      }
    }

    return movesTranslate;
  };

    render() {
        return (
            <>
                <div className='container'>
                    <div className='card'>
                        <div className="img-container">
                            <img src={this.state.pokemonSpriteUrl} alt="img"/>
                        </div>
                        <div className="details">
                            <h1>{this.state.pokemonName}</h1>
                            <div className='col'>    
                                <div className='row' >
                                    <h2>Movimientos</h2>
                                    {this.state.pokemonMoves.map((move, index) => {
                                        return (
                                            <div key={index}>
                                                <div>{move.names[5].name}</div>
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className='row'>
                                    <h2>Tipo</h2>
                                    {this.state.pokemonTypes.map((type, index) => {
                                        return(
                                            <div key={index}>{type}</div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                    <button className="get-pokemon-btn" onClick={this.loadRandomPokemonCard}>Obtener Pokemón</button>
                </div>
            </>
        );
    }
}

export default Pokemon ;