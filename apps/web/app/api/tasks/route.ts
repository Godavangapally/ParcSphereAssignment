// FILE: apps/web/app/api/tasks/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { z } from "zod";

const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  dueDate: z.string(),
  status: z.enum(["pending", "completed"]).default("pending"),
});

// GET - Fetch all tasks for logged-in user
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const db = await getDatabase();
    const tasks = await db
      .collection("tasks")
      .find({ userId: new ObjectId(session.user.id) })
      .sort({ createdAt: -1 })
      .toArray();
    
    return NextResponse.json(tasks);
  } catch (error) {
    console.error("Get tasks error:", error);
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}

// POST - Create new task
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const body = await request.json();
    const validatedData = taskSchema.parse(body);
    
    const db = await getDatabase();
    const result = await db.collection("tasks").insertOne({
      ...validatedData,
      userId: new ObjectId(session.user.id),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    
    const newTask = await db
      .collection("tasks")
      .findOne({ _id: result.insertedId });
    
    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }
    
    console.error("Create task error:", error);
    return NextResponse.json(
      { error: "Failed to create task" },
      { status: 500 }
    );
  }
}

// PATCH - Edit task (title, description, dueDate)
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const body = await request.json();
    const { taskId, title, description, dueDate } = body;
    
    if (!taskId || !title || !description || !dueDate) {
      return NextResponse.json(
        { error: "Task ID, title, description, and due date are required" },
        { status: 400 }
      );
    }
    
    const db = await getDatabase();
    
    // Check if task exists and belongs to user
    const existingTask = await db.collection("tasks").findOne({
      _id: new ObjectId(taskId),
      userId: new ObjectId(session.user.id),
    });
    
    if (!existingTask) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }
    
    // Check if due date hasn't passed (can only edit before due date)
    const taskDueDate = new Date(existingTask.dueDate as string);
    const now = new Date();
    now.setHours(0, 0, 0, 0); // Reset to start of day for fair comparison
    
    if (taskDueDate < now && existingTask.status === "pending") {
      return NextResponse.json(
        { error: "Cannot edit overdue tasks" },
        { status: 400 }
      );
    }
    
    // Update task
    const result = await db.collection("tasks").updateOne(
      {
        _id: new ObjectId(taskId),
        userId: new ObjectId(session.user.id),
      },
      {
        $set: {
          title,
          description,
          dueDate,
          updatedAt: new Date(),
        },
      }
    );
    
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }
    
    const updatedTask = await db
      .collection("tasks")
      .findOne({ _id: new ObjectId(taskId) });
    
    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error("Edit task error:", error);
    return NextResponse.json(
      { error: "Failed to edit task" },
      { status: 500 }
    );
  }
}

// PUT - Update task status (toggle complete/pending)
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const body = await request.json();
    const { taskId, status } = body;
    
    if (!taskId || !status) {
      return NextResponse.json(
        { error: "Task ID and status are required" },
        { status: 400 }
      );
    }
    
    const db = await getDatabase();
    const result = await db.collection("tasks").updateOne(
      {
        _id: new ObjectId(taskId),
        userId: new ObjectId(session.user.id),
      },
      {
        $set: {
          status,
          updatedAt: new Date(),
        },
      }
    );
    
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }
    
    const updatedTask = await db
      .collection("tasks")
      .findOne({ _id: new ObjectId(taskId) });
    
    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error("Update task error:", error);
    return NextResponse.json(
      { error: "Failed to update task" },
      { status: 500 }
    );
  }
}

// DELETE - Delete task
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const { searchParams } = new URL(request.url);
    const taskId = searchParams.get("id");
    
    if (!taskId) {
      return NextResponse.json(
        { error: "Task ID is required" },
        { status: 400 }
      );
    }
    
    const db = await getDatabase();
    const result = await db.collection("tasks").deleteOne({
      _id: new ObjectId(taskId),
      userId: new ObjectId(session.user.id),
    });
    
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }
    
    return NextResponse.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Delete task error:", error);
    return NextResponse.json(
      { error: "Failed to delete task" },
      { status: 500 }
    );
  }
}