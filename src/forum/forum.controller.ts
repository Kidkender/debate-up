import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { CreateCommentDto } from './dtos/add-comment.dto';
import { CreatePostDto } from './dtos/create-post.dto';
import { UpdateCommentDto } from './dtos/update-comment.dto';
import { UpdatePostDto } from './dtos/update-post.dto';
import { ForumService } from './forum.service';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/auth/decorators/public.decorator';

@ApiTags('Forum')
@Controller('forum')
@UseGuards(AuthGuard)
export class ForumController {
  constructor(private readonly forumService: ForumService) {}

  @Post('Post')
  createPost(
    @CurrentUser() userId: number,
    @Body() createPostDto: CreatePostDto,
  ) {
    return this.forumService.createPost(userId, createPostDto);
  }

  @Get('post')
  @Public()
  getPosts(
    @Query('skip', ParseIntPipe) skip = 0,
    @Query('take', ParseIntPipe) take = 10,
  ) {
    return this.forumService.getPosts(skip, take);
  }

  @Get('post/:postId')
  @Public()
  getPostById(@Param('postId', ParseIntPipe) postId: number) {
    return this.forumService.getPostById(postId);
  }

  @Post('comment')
  addComment(
    @CurrentUser() userId: number,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.forumService.addComment(userId, createCommentDto);
  }

  @Put('post')
  updatePost(
    @CurrentUser() userId: number,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.forumService.updatePost(userId, updatePostDto);
  }

  @Delete('post/:postId')
  deletePost(
    @CurrentUser() userId: number,
    @Param('postId', ParseIntPipe) postId: number,
  ) {
    return this.forumService.deletePost(postId, userId);
  }

  @Put('comment')
  updateComment(
    @CurrentUser() userId: number,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    return this.forumService.updateComment(userId, updateCommentDto);
  }

  @Delete('comment/:commentId')
  deleteComment(
    @CurrentUser() userId: number,
    @Param('commentId', ParseIntPipe) commentId: number,
  ) {
    return this.forumService.deleteComment(commentId, userId);
  }

  @Get('comment/:id')
  @Public()
  async getCommentByPost(@Param('id', ParseIntPipe) id: number) {
    return this.forumService.getCommentByPost(id);
  }
}
