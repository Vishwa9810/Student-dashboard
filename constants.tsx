
import React from 'react';

export const EXTERNAL_LINKS = [
  { name: 'WhatsApp', url: 'https://web.whatsapp.com/', icon: '💬' },
  { name: 'Outlook', url: 'https://outlook.live.com/mail/', icon: '📧' },
  { name: 'Bocconi Portal', url: 'https://idp.unibocconi.it/idp/profile/SAML2/POST/SSO?execution=e1s1', icon: '🎓' },
];

export const MOCK_ATTENDANCE = [
  { courseId: '1', courseName: 'Macroeconomics', attended: 12, total: 15 },
  { courseId: '2', courseName: 'Data Science', attended: 8, total: 10 },
  { courseId: '3', courseName: 'Corporate Finance', attended: 14, total: 15 },
  { courseId: '4', courseName: 'Business Ethics', attended: 5, total: 8 },
];

export const MOCK_TASKS = [
  { id: 't1', title: 'Problem Set 4', dueDate: '2024-05-20', course: 'Macroeconomics', priority: 'high', completed: false },
  { id: 't2', title: 'Group Project Draft', dueDate: '2024-05-22', course: 'Data Science', priority: 'medium', completed: false },
  { id: 't3', title: 'Case Study Prep', dueDate: '2024-05-18', course: 'Corporate Finance', priority: 'low', completed: true },
];

export const MOCK_EXAMS = [
  { id: 'e1', course: 'Macroeconomics Final', date: '2024-06-15', location: 'Hall A' },
  { id: 'e2', course: 'Data Science Midterm', date: '2024-05-28', location: 'Room 302' },
];

export const MOCK_INTERNSHIPS = [
  { id: 'i1', company: 'Goldman Sachs', role: 'Summer Analyst', status: 'interview', dateApplied: '2024-04-01' },
  { id: 'i2', company: 'Google', role: 'SWE Intern', status: 'applied', dateApplied: '2024-04-10' },
  { id: 'i3', company: 'McKinsey', role: 'Business Analyst', status: 'rejected', dateApplied: '2024-03-15' },
];
