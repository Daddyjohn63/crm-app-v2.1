import { List, User } from '@/db/schema';

interface ListContainerProps {
  boardId: number;
  data: List[];
  user: User;
}

export const ListContainer = ({ boardId, data, user }: ListContainerProps) => {
  console.log(data);
  console.log(user);
  console.log(boardId);
  return (
    <div>
      <h1>List Container</h1>
      {data.map(list => (
        <div key={list.id}>
          <h2>{list.name}</h2>
        </div>
      ))}
    </div>
  );
};
