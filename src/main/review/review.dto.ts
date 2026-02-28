import { IsString, IsOptional, IsUUID, IsInt, Min, Max, IsBoolean } from 'class-validator';

export class CreateReviewDto {
    @IsUUID()
    productId: string;

    @IsInt()
    @Min(1)
    @Max(5)
    rating: number;

    @IsOptional()
    @IsString()
    comment?: string;
}

export class UpdateReviewDto {
    @IsUUID()
    id: string;

    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(5)
    rating?: number;

    @IsOptional()
    @IsString()
    comment?: string;
}

export class ApproveReviewDto {
    @IsBoolean()
    isApproved: boolean;
}
