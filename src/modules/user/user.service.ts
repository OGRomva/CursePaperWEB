import {Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {User} from "./user.model";
import {UserCreationDto} from "./dto/userCreationDto";
import {UserUpdateDto} from "./dto/userUpdate.dto";

@Injectable()
export class UserService {
    constructor(@InjectModel(User) private userRep: typeof User) {}

    async createUser(dto: UserCreationDto) {
        await this.userRep.sync({alter: true})
        return await this.userRep.create(dto);
    }

    async findAll() {
        await this.userRep.sync({alter: true})
        return await this.userRep.findAll();
    }

    async findById(id: number) {
        await this.userRep.sync({alter: true})
        return await this.userRep.findByPk(id);
    }

    async findByUsername(username: string) {
        await this.userRep.sync({alter: true})
        return await this.userRep.findOne({
            where: {username: username},
            rejectOnEmpty: false
        })
    }

    async update(id: number, dto: UserUpdateDto) {
        await this.userRep.sync({alter: true})
        return await this.userRep.update({refresh_token: dto.refresh_token}, {where: {user_id: id}});
    }

    async delete(id: number) {
        await this.userRep.sync({alter: true})
        return await this.userRep.destroy({where: {user_id: id}})
    }
}
