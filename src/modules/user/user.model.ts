import {Column, DataType, HasMany, Model, Table} from "sequelize-typescript";
import {Repositories} from "../repositories/repositories.model";

interface UserCreationAttrs {
    username: string,
    password: string
    refresh_token: string;
}

@Table({tableName: 'User'})
export class User extends Model<User, UserCreationAttrs> {
    @Column({type: DataType.INTEGER, unique: true, primaryKey: true, allowNull: false, autoIncrement: true})
    user_id: number;

    @Column({type: DataType.STRING, unique: true, allowNull: false})
    username: string;

    @Column({type: DataType.STRING, allowNull: false})
    password: string;

    @Column({type: DataType.STRING})
    refresh_token: string;

    @HasMany(() => Repositories)
    reps: Repositories[];
}
