import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import CreateEditProjectButton from './_components/create-edit-project-button';

// Mock data - will be replaced with real data later
const mockStats = {
  totalTasks: 45,
  completedTasks: 28,
  openTasks: 17,
  lateTasks: 3,
  thisWeekTasks: 12
};

const mockUpcomingTasks = [
  {
    id: 1,
    title: 'Design new landing page',
    dueDate: '2024-02-20',
    status: 'In Progress',
    priority: 'High'
  },
  {
    id: 2,
    title: 'Update user documentation',
    dueDate: '2024-02-21',
    status: 'Not Started',
    priority: 'Medium'
  },
  {
    id: 3,
    title: 'Fix navigation bug',
    dueDate: '2024-02-19',
    status: 'Late',
    priority: 'High'
  },
  {
    id: 4,
    title: 'Implement authentication',
    dueDate: '2024-02-22',
    status: 'In Progress',
    priority: 'High'
  },
  {
    id: 5,
    title: 'Write API documentation',
    dueDate: '2024-02-23',
    status: 'Not Started',
    priority: 'Low'
  }
];

export default function ProjectsPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Projects Dashboard</h1>
        {/* <Button>
          <Plus className="w-4 h-4 mr-2" />
          New Project
        </Button> */}
        <CreateEditProjectButton boardId={null} />
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.totalTasks}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {mockStats.completedTasks}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {mockStats.openTasks}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Late Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {mockStats.lateTasks}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {mockStats.thisWeekTasks}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tasks Table */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Upcoming Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Task</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockUpcomingTasks.map(task => (
                <TableRow key={task.id}>
                  <TableCell className="font-medium">{task.title}</TableCell>
                  <TableCell>
                    {new Date(task.dueDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        task.status === 'Late'
                          ? 'destructive'
                          : task.status === 'In Progress'
                          ? 'default'
                          : 'secondary'
                      }
                    >
                      {task.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        task.priority === 'High'
                          ? 'border-red-500 text-red-500'
                          : task.priority === 'Medium'
                          ? 'border-yellow-500 text-yellow-500'
                          : 'border-green-500 text-green-500'
                      }
                    >
                      {task.priority}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
