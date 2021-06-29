import { Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileUploadDto } from 'src/dtos/file-upload.dto';
import { CreateCatDto } from 'src/dtos/create-cat.dto';
import { diskStorage } from 'multer';

@ApiTags('cats')
@Controller('cats')
export class CatsController {
    @Post()
    async create(@Body() createCatDto: CreateCatDto) {
        return `This action adds a new object with name: ${createCatDto.name}`;
    }

    @Post('upload')
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: 'File',
        type: FileUploadDto,
    })
    @UseInterceptors( FileInterceptor('file', {
            storage: diskStorage({
                destination: './files',
                // filename: editFileName,
            }),
        })
    )
    uploadFile(@UploadedFile() file: Express.Multer.File) {
        console.log(file.size);
        return file.size;
    }
}
