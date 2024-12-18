import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Cat } from './entities/cat.entity';
import { Repository } from 'typeorm';
import { Breed } from '../breeds/entities/breed.entity';
import { ActiveUserInterface } from '../common/interfaces/userActive.interfaces';
import { Role } from 'src/common/enums/role.enum';

@Injectable()
export class CatsService {

  constructor(
    @InjectRepository(Cat)
    private readonly catRepository: Repository<Cat>,

    @InjectRepository(Breed)
    private readonly breedRepository: Repository<Breed>
  ) { }

  async create(createCatDto: CreateCatDto, user: ActiveUserInterface) {
    const breed = await this.validatorBreed(createCatDto.breed)

    return await this.catRepository.save({
      ...createCatDto,
      breed,
      userEmail: user.email
    })
  }

  async findAll(user: ActiveUserInterface) {
    return await this.catRepository.find({
      where: { userEmail: user.email }
    });
  }

  async findOne(id: number, user: ActiveUserInterface) {
    const cat = await this.catRepository.findOneBy({ id })

    if (!cat) {
      throw new BadRequestException("Cat not found")
    }

    this.validatorOwnership(cat, user)

    return await this.catRepository.findOneBy({ id })
  }

  async update(id: number, updateCatDto: UpdateCatDto, user: ActiveUserInterface) {
    await this.findOne(id, user)
    const { breedId, age, name } = updateCatDto

    await this.catRepository.update(id,
      {
        age,
        name,
        breed: breedId ? await this.validatorBreed(breedId) : undefined,
        userEmail: user.email
      }
    )

    return await this.catRepository.findOneByOrFail({ id });
  }

  async remove(id: number, user: ActiveUserInterface) {
    await this.findOne(id, user)

    return await this.catRepository.softDelete({ id });
  }

  private validatorOwnership(cat: Cat, user: ActiveUserInterface) {
    if (cat.userEmail !== user.email && user.role !== Role.ADMIN)
      throw new UnauthorizedException('Cat not found')
  }

  private async validatorBreed(breedId: number) {
    const breed = await this.breedRepository.findOneBy({ id: breedId })

    if (!breed) {
      throw new BadRequestException('Bread not found')
    }

    return breed
  }



}
