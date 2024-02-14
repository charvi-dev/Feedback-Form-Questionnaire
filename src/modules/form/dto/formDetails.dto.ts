export class formDetailsDto {

    title: string;
    userId: number;
    description: string;
    status: 'draft' | 'published' | 'closed';
    publishedDate: Date;
    closeDate: Date;
    link: string;
}


