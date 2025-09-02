const Course = ({ course }) => {
  return (
    <div>
      <Header name={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  )
}

const Header = ({ name }) => {
  return (
    <div>
      <h1>{name}</h1>
    </div>
  )
}

const Content = ({ parts }) => {
  return (
    <div>
      {parts.map( part => <Part key={part.id} part={part}/> )}
    </div>
  )
}

const Part = ({ part }) => {
  return (
      <p>{part.name} {part.exercises}</p>
  )
}

const Total = ({ parts }) => {
  const total = parts.reduce(
    (acc, part) => acc + part.exercises, 0
  )
  
  return (
    <div>
      <h3>total of {total} exercises</h3>
    </div>
  )
}

export default Course