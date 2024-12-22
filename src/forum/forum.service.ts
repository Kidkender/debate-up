import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { HttpService } from 'src/common/http.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCommentDto } from './dtos/add-comment.dto';
import { CommentResponseDto } from './dtos/comment-response.dto';
import { CreatePostDto } from './dtos/create-post.dto';
import { UpdateCommentDto } from './dtos/update-comment.dto';
import { UpdatePostDto } from './dtos/update-post.dto';
import { IDetecToxic } from './forum.interface';

@Injectable()
export class ForumService {
  private readonly logger = new Logger(ForumService.name);

  constructor(
    private prismaService: PrismaService,
    private httpService: HttpService,
  ) {
    this.httpService = new HttpService(process.env.AI_API_URL);
  }

  async isSensitiveContent(essay: string): Promise<IDetecToxic> {
    return this.httpService.post('/detect_toxic', { essay });
  }

  async validateSensitiveContent(content: string, field: string) {
    const result = await this.isSensitiveContent(content);

    if (result.main_result) {
      throw new BadRequestException(
        `${field} contains toxic content: ${result.reason[0].content_type}`,
      );
    }
  }

  async createPost(userId: number, data: CreatePostDto) {
    const { title, content } = data;

    await this.validateSensitiveContent(title, 'Title');
    await this.validateSensitiveContent(content, 'Content');

    const post = await this.prismaService.forum.create({
      data: {
        userId,
        title,
        content,
      },
    });
    this.logger.log(`User ${userId} created post id ${post.id}`);
  }

  async getPosts(skip: number = 0, take: number = 10) {
    const posts = await this.prismaService.forum.findMany({
      skip,
      take,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
      },
    });

    const postsWithCommentsCount = await Promise.all(
      posts.map(async (post) => {
        const commentsCount = await this.prismaService.forumComment.count({
          where: { forumId: post.id },
        });
        return {
          ...post,
          commentsCount,
        };
      }),
    );

    return postsWithCommentsCount;
  }

  async getPostById(postId: number) {
    const post = await this.prismaService.forum.findUnique({
      where: { id: postId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
        comments: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatarUrl: true,
              },
            },
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

    await this.validateSensitiveContent(comment, 'Comment');

    await this.getPostById(forumId);

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

    await this.validateSensitiveContent(title, 'Title');
    await this.validateSensitiveContent(content, 'Content');

    const post = await this.prismaService.forum.findUnique({
      where: { id: postId },
    });

    if (!post || post.userId !== userId) {
      throw new ForbiddenException('You do not have permission to access');
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

    await this.validateSensitiveContent(newComment, 'Comment');

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

  async getCommentByPost(postId: number): Promise<CommentResponseDto[]> {
    const post = await this.getPostById(postId);

    const comments = await this.prismaService.forumComment.findMany({
      where: { forumId: postId },
      select: {
        id: true,
        comment: true,
        user: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
      },
    });

    return plainToInstance(CommentResponseDto, comments);
  }
}
