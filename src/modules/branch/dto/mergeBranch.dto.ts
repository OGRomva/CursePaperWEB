export class MergeBranchDto {
    mainBranchId: number;
    slaveBranchId: number;
    message: string;
    shouldDel: boolean;
}