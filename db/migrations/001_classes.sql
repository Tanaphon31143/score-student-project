-- ห้องเรียน: ครู 1 คนมีได้หลายห้อง
CREATE TABLE IF NOT EXISTS `classroom` (
  `id` varchar(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `subject` varchar(255) NOT NULL,
  `section` varchar(100) DEFAULT NULL,
  `teacherId` varchar(36) NOT NULL,
  `createdAt` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `classroom_teacher` (`teacherId`),
  CONSTRAINT `classroom_teacher_fk` FOREIGN KEY (`teacherId`) REFERENCES `user` (`id`) ON DELETE CASCADE
);

-- นักเรียนในห้อง (1 คนอยู่ได้หลายห้อง)
CREATE TABLE IF NOT EXISTS `enrollment` (
  `classId` varchar(36) NOT NULL,
  `studentId` varchar(36) NOT NULL,
  `createdAt` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`classId`, `studentId`),
  KEY `enrollment_student` (`studentId`),
  CONSTRAINT `enrollment_class_fk` FOREIGN KEY (`classId`) REFERENCES `classroom` (`id`) ON DELETE CASCADE,
  CONSTRAINT `enrollment_student_fk` FOREIGN KEY (`studentId`) REFERENCES `user` (`id`) ON DELETE CASCADE
);
