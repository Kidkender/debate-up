import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { CreateCommentDto } from './dtos/add-comment.dto';
import { CreatePostDto } from './dtos/create-post.dto';
import { UpdatePostDto } from './dtos/update-post.dto';
import { ForumService } from './forum.service';

@Controller('forum')
export class ForumController {
  constructor(private readonly forumService: ForumService) {}

  @Post()
  createPost(
    @CurrentUser() userId: number,
    @Body() createPostDto: CreatePostDto,
  ) {
    return this.forumService.createPost(userId, createPostDto);
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
  addComment(
    @CurrentUser() userId: number,
    @Body() addCommentDto: CreateCommentDto,
  ) {
    return this.forumService.addComment(userId, addCommentDto);
  }

  @Patch(':id')
  updatePost(
    @CurrentUser() userId: number,

    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.forumService.updatePost(userId, updatePostDto);
  }

  @Delete(':id')
  deletePost(@CurrentUser() userId: number, @Param('id') id: number) {
    return this.forumService.deletePost(id, userId);
  }
}
