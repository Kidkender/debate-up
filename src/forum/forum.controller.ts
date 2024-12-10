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

@Controller('forum')
export class ForumController {
  constructor(private readonly forumService: ForumService) {}

  @Post('post')
  @UseGuards(AuthGuard)
  createPost(
    @CurrentUser() userId: number,
    @Body() createPostDto: CreatePostDto,
  ) {
    return this.forumService.createPost(userId, createPostDto);
  }

  @Get('post')
  getPosts(
    @Query('skip', ParseIntPipe) skip = 0,
    @Query('take', ParseIntPipe) take = 10,
  ) {
    return this.forumService.getPosts(skip, take);
  }

  @Get('post/:postId')
  getPostById(@Param('postId', ParseIntPipe) postId: number) {
    return this.forumService.getPostById(postId);
  }

  @Post('comment')
  @UseGuards(AuthGuard)
  addComment(
    @CurrentUser() userId: number,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.forumService.addComment(userId, createCommentDto);
  }

  @Put('post')
  @UseGuards(AuthGuard)
  updatePost(
    @CurrentUser() userId: number,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.forumService.updatePost(userId, updatePostDto);
  }

  @Delete('post/:postId')
  @UseGuards(AuthGuard)
  deletePost(
    @CurrentUser() userId: number,
    @Param('postId', ParseIntPipe) postId: number,
  ) {
    return this.forumService.deletePost(postId, userId);
  }

  @Put('comment')
  @UseGuards(AuthGuard)
  updateComment(
    @CurrentUser() userId: number,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    return this.forumService.updateComment(userId, updateCommentDto);
  }

  @Delete('comment/:commentId')
  @UseGuards(AuthGuard)
  deleteComment(
    @CurrentUser() userId: number,
    @Param('commentId', ParseIntPipe) commentId: number,
  ) {
    return this.forumService.deleteComment(commentId, userId);
  }
}
