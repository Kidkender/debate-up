export const selectCourseFields = {
  id: true,
  title: true,
  description: true,
  level: true,
  duration: true,
  lessons: {
    select: {
      id: true,
      title: true,
      content: true,
      contentUrl: true,
      order: true,
    },
  },
};

export const selectCourseWithoutLessons = {
  id: true,
  title: true,
  description: true,
  level: true,
  duration: true,
};
