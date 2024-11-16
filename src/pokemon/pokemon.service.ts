import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { isValidObjectId, Model } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class PokemonService {
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
  ) {}

  async create(createPokemonDto: CreatePokemonDto) {
    /*
     * Lowercase the name
     */
    createPokemonDto.name = createPokemonDto.name.toLowerCase().trim();
    /**
     * Create a new pokemon
     */
    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon;
    } catch (err) {
      if (err.code === 11000) {
        /**
         * If the pokemon already exists in the db, throw a BadRequestException
         */
        throw new BadRequestException(
          `Pokemon already exists in db ${JSON.stringify(err.keyValue)}`,
        );
      }
      /**
       * If there is an error creating the pokemon, throw an InternalServerErrorException
       */
      throw new InternalServerErrorException(
        "Cant't create pokemon - Check the logs",
      );
    }
  }

  findAll() {
    return `This action returns all pokemon`;
  }

  async findOne(term: string) {
    let pokemon: Pokemon;

    if (!isNaN(+term)) {
      pokemon = await this.pokemonModel.findOne({ no: term });
    } else if (isValidObjectId(term)) {
      //MongoId
      pokemon = await this.pokemonModel.findById(term);
    } else if (!pokemon) {
      //Name
      pokemon = await this.pokemonModel.findOne({
        name: term.toLowerCase().trim(),
      });
      if (!pokemon)
        throw new NotFoundException(
          `Pokemon with id, name or no "${term}" not found`,
        );
    }

    return pokemon;
  }

  update(id: number, updatePokemonDto: UpdatePokemonDto) {
    return `This action updates a #${id} pokemon`;
  }

  remove(id: number) {
    return `This action removes a #${id} pokemon`;
  }
}
