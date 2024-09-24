import {Column, DataType, ForeignKey, HasMany, Model, Table} from "sequelize-typescript";
import {User} from "../user/user.model";
import {Branch} from "../branch/branch.model";

interface RepositoryCreationAttrs {
    title: string;
    owner_id: number;
}

@Table({tableName: 'Repos'})
export class Repositories extends Model<Repositories, RepositoryCreationAttrs> {
    @Column({type: DataType.INTEGER, unique: true, primaryKey: true, allowNull: false, autoIncrement: true})
    rep_id: number;

    @Column({type: DataType.STRING})
    title: string;

    @ForeignKey(() => User)
    @Column({type: DataType.INTEGER, allowNull: false})
    owner_id: number;

    @HasMany(() => Branch)
    branches: Branch[];
}