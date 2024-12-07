import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  Req,
} from '@nestjs/common';
import { ForumService } from './forum.service';
import { CreatePostDto } from './dtos/create-post.dto';
import { CreateCommentDto } from './dtos/add-comment.dto';
import { UpdatePostDto } from './dtos/update-post.dto';

@Controller('forum')
export class ForumController {
  constructor(private readonly forumService: ForumService) {}

  @Post()
  createPost(@Req() req, @Body() createPostDto: CreatePostDto) {
    return this.forumService.createPost(req.user.id, createPostDto);
  }

  @Get()
  getPosts(@Query('skip') skip: number, @Query('take') take: number) {
    return this.forumService.getPosts(skip, take);
  }

  @Get(':id')
  getPostById(@Param('id') id: number) {
    return this.forumService.getPostById(id);
  }

  @Post(':id/comment')
  addComment(@Req() req, @Body() addCommentDto: CreateCommentDto) {
    return this.forumService.addComment(req.user.id, addCommentDto);
  }

  @Patch(':id')
  updatePost(
    @Req() req,

    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.forumService.updatePost(req.user.id, updatePostDto);
  }

  @Delete(':id')
  deletePost(@Req() req, @Param('id') id: number) {
    return this.forumService.deletePost(id, req.user.id);
  }
}
