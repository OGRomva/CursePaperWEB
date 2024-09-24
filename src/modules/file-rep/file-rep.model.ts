import {Column, DataType, ForeignKey, Model, Table} from "sequelize-typescript";
import {Commit} from "../commit/commit.model";

interface FileRepCreationAttrs {
    commit_id: number;
    fileName: string;
    filePath: string;
}

@Table({tableName: 'fileRep', timestamps: false})
export class FileRep extends Model<FileRep, FileRepCreationAttrs>{
    @Column({type: DataType.INTEGER, unique: true, primaryKey: true, allowNull: false, autoIncrement: true})
    fileRep_id: number;

    @ForeignKey(() => Commit)
    @Column({type: DataType.INTEGER, allowNull: false})
    commit_id: number;

    @Column({type: DataType.STRING, allowNull: false})
    fileName: string

    @Column({type: DataType.STRING, allowNull: false})
    filePath: string
}