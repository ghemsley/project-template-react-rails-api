# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)
projects = Project.create([{ name: 'Final project', description: 'Phase 5 project built with Rails, React and Redux', order: 0 },
                           { name: 'Job search', description: 'Things I need to do to find a job as a developer',
                             order: 1 }])

projects.each do |project, _i|
  categories = Category.create([{ name: 'Needs doing', description: 'Work that still needs to be done', order: 0, project: project },
                                { name: 'In progress', description: 'Work that has already been started', order: 1,
                                  project: project },
                                { name: 'Done', description: 'Work that has been finished', order: 2,
                                  project: project }])
  categories.each_with_index do |category, _j|
    Todo.create([{ name: 'Test todo', description: 'Todo or not todo, that is the question?', order: 0, category: category },
                 { name: 'Test todo 2',
                   description: 'Test Todo: The Motion Picture: The Sequel: The Game: The Broadway Musical: The JSON Response', order: 1, category: category },
                 { name: 'Test todo 3', description: 'Todo the third', order: 2, category: category }])
  end
  users = User.create([{ username: 'test', password: 'test', password_confirmation: 'test' },
                       { username: 'test2', password: 'test2', password_confirmation: 'test2' }])
  users.each do |user|
    UserProject.create([{ user_id: user.id, project_id: project.id }])
  end
end
