import {Column, DataType, ForeignKey, HasMany, Model, Table} from "sequelize-typescript";
import {Repositories} from "../repositories/repositories.model";
import {Commit} from "../commit/commit.model";

interface BranchCreationAttrs {
    title: string;
    repos_id: number;
}

@Table({tableName: 'branch'})
export class Branch extends Model<Branch, BranchCreationAttrs> {
    @Column({type: DataType.INTEGER, unique: true, primaryKey: true, allowNull: false, autoIncrement: true})
    branch_id: number;

    @Column({type: DataType.STRING, allowNull: false})
    title: string;

    @ForeignKey(() => Repositories)
    @Column({type: DataType.INTEGER, allowNull: false})
    repos_id: number;

    @HasMany(() => Commit)
    commits: Commit[];


}