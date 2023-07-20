import Image from "next/image";
import { db } from "./db";
import { users } from "./db/schema";
import { InferModel } from "drizzle-orm";
import { revalidatePath } from "next/cache";

type newUser = InferModel<typeof users, "insert">;

export default async function Home() {
  const allUsers = await db.select().from(users);

  async function create(data: FormData) {
    "use server";

    const fullName = data.get("full_name")?.toString();
    const phone = data.get("phone")?.toString();

    if (!fullName || !phone) {
      return;
    }

    await db.insert(users).values({
      fullName,
      phone,
    });

    revalidatePath("/");
  }

  const results: Array<any> = [];

  allUsers.forEach((user, index) => {
    results.push(
      <div className="grid grid-cols-2" key={index}>
        <p>
          <span className="font-bold">Name:</span> {user.fullName}
        </p>
        <p>
          <span className="font-bold">Phone:</span> {user.phone}
        </p>
      </div>
    );
  });

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-gray-400 text-gray-700">
      <form action={create} className="flex flex-col gap-3">
        <input
          type="text"
          className="p-3"
          name="full_name"
          placeholder="Full Name"
        />
        <input
          type="text"
          name="phone"
          className="p-3"
          placeholder="Phone Number"
        />
        <button
          type="submit"
          className="bg-gray-700 px-4 py-2 text-white hover:bg-gray-800"
        >
          Create
        </button>
      </form>
      <div className="mt-5 flex flex-col gap-1">{results}</div>
    </div>
  );
}
