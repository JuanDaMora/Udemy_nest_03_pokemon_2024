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
      this.handleException(err);
    }
  }

  findAll() {
    return `This action returns all pokemon`;
  }

  async findOne(term: string) {
    let pokemon: Pokemon;

    if (!isNaN(+term)) {
      // no: is a property of the pokemon entity
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

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    /**
     * find the pokemon if it exists
     */
    const pokemon = await this.findOne(term);
    /**
     * Lowercase the name and trim it
     */
    if (updatePokemonDto.name) {
      updatePokemonDto.name = updatePokemonDto.name.toLowerCase().trim();
    }

    try {
      /**
       * Update the pokemon
       */
      await pokemon.updateOne(updatePokemonDto, { new: true });

      return { ...pokemon.toJSON(), ...updatePokemonDto };
    } catch (err) {
      this.handleException(err);
    }
  }

  async remove(_id: string) {
    // const pokemon = await this.findOne(id);
    // await pokemon.deleteOne();
    const { deletedCount } = await this.pokemonModel.deleteOne({ _id });
    if (deletedCount === 0) {
      throw new NotFoundException(`Pokemon with id "${_id}" not found`);
    }
    return;
  }

  private handleException(error: any) {
    if (error.code === 11000) {
      /**
       * If the pokemon already exists in the db, throw a BadRequestException
       */
      throw new BadRequestException(
        `Pokemon already exists in db ${JSON.stringify(error.keyValue)}`,
      );
    } /**
     * If there is an error creating the pokemon, throw an InternalServerErrorException
     */
    throw new InternalServerErrorException(
      "Cant't create pokemon - Check the logs",
    );
  }
}
