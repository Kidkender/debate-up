import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDto } from './dtos/create-post.dto';
import { CreateCommentDto } from './dtos/add-comment.dto';
import { Forum } from '@prisma/client';
import { UpdateCommentDto } from './dtos/update-comment.dto';
import { UpdatePostDto } from './dtos/update-post.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class ForumService {
  private readonly logger = new Logger(ForumService.name);

  constructor(
    private prismaService: PrismaService,
    private userService: UserService,
  ) {}

  async createPost(userId: number, data: CreatePostDto) {
    const { title, content } = data;
    const post = await this.prismaService.forum.create({
      data: {
        userId,
        title,
        content,
      },
    });
    this.logger.log(`User ${userId} created post ${post.id}`);
  }

  async getPosts(skip: number = 0, take: number = 10) {
    return this.prismaService.forum.findMany({
      skip,
      take,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: true,
        comments: true,
      },
    });
  }

  async getPostById(postId: number) {
    const post = this.prismaService.forum.findUnique({
      where: { id: postId },
      include: {
        user: true,
        comments: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!post) {
      throw new NotFoundException(`Post ${postId} not found`);
    }
    return post;
  }

  async addComment(userId: number, data: CreateCommentDto) {
    const { comment, parentId, forumId } = data;
    const newComment = this.prismaService.forumComment.create({
      data: {
        userId,
        forumId,
        comment,
        parentId,
      },
    });
    this.logger.log(`Comment ${newComment} is added`);
  }

  async updatePost(userId: number, data: UpdatePostDto) {
    const { postId, title, content } = data;

    const post = await this.prismaService.forum.findUnique({
      where: { id: postId },
    });
    if (!post || post.userId !== userId) {
      throw new Error('Bạn không có quyền chỉnh sửa bài viết này');
    }
    await this.prismaService.forum.update({
      where: { id: postId },
      data: {
        title,
        content,
      },
    });

    this.logger.log(`User ${userId} updated post ${postId}`);
  }

  async updateComment(userId: number, data: UpdateCommentDto) {
    const { commentId, newComment } = data;

    const comment = await this.prismaService.forumComment.findUnique({
      where: { id: commentId },
    });
    if (!comment || comment.userId !== userId) {
      throw new Error('You do not have permission to edit this comment');
    }
    await this.prismaService.forumComment.update({
      where: { id: commentId },
      data: {
        comment: newComment,
      },
    });

    this.logger.log(`User ${userId} updated comment ${commentId}`);
  }

  async deletePost(postId: number, userId: number) {
    const post = await this.prismaService.forum.findUnique({
      where: { id: postId },
    });
    if (!post || post.userId !== userId) {
      throw new Error(
        `User ${userId} do not have permission to delete post ${post.id} `,
      );
    }
    return this.prismaService.forum.delete({ where: { id: postId } });
  }

  async deleteComment(commentId: number, userId: number) {
    const comment = await this.prismaService.forumComment.findUnique({
      where: { id: commentId },
    });
    if (!comment || comment.userId !== userId) {
      throw new Error(
        `User ${userId} do not have permission to delete comment ${comment.id} `,
      );
    }
    return this.prismaService.forumComment.delete({ where: { id: commentId } });
  }
}
