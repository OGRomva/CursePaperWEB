import {Column, DataType, ForeignKey, HasMany, Model, Table} from "sequelize-typescript";
import {Repositories} from "../repositories/repositories.model";
import {Branch} from "../branch/branch.model";
import {FileRep} from "../file-rep/file-rep.model";
import { User } from '../user/user.model';

interface CommitCreationAttrs {
    message: string;
    branch_id: number;
    creator_id: number;
}

@Table({tableName: 'commit'})
export class Commit extends Model<Commit, CommitCreationAttrs> {
    @Column({type: DataType.INTEGER, unique: true, primaryKey: true, allowNull: false, autoIncrement: true})
    commit_id: number;

    @Column({type: DataType.STRING, allowNull: false})
    message: string;

    @ForeignKey(() => Branch)
    @Column({type: DataType.INTEGER, allowNull: false})
    branch_id: number;

    @ForeignKey(() => User)
    @Column({type: DataType.INTEGER, allowNull: false})
    creator_id: number;

    @HasMany(() => FileRep)
    files: FileRep[];
}