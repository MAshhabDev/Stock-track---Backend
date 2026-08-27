import bcrypt from "bcryptjs";
import config from "../config";
import { prisma } from "../lib/prisma";
import { Role } from "../../generated/prisma/enums";

// ১. Admin User Seeder
export const seedAdmin = async () => {
  try {
    const adminEmail = config.admin_email || "admin@stocktrack.com";
    const adminPassword = config.admin_password || "admin123";
    const adminName = config.admin_name || "System Admin";

    const isAdminExist = await prisma.user.findUnique({
      where: {
        email: adminEmail,
      },
    });

    if (isAdminExist) {
      console.log("Admin User Already Exists!");
      return;
    }

    const hashedPassword = await bcrypt.hash(
      adminPassword,
      Number(config.bcrypt_salt_rounds) || 10,
    );

    const admin = await prisma.user.create({
      data: {
        name: adminName,
        email: adminEmail,
        password: hashedPassword,
        role: Role.ADMIN,
        isActive: true,
      },
    });

    // console.log("Admin User Created Successfully: ", admin.email);
  } catch (error) {
    // console.log("Error Seeding Admin User: ", error);
  }
};

export const seedStaff = async () => {
  try {
    const staffEmail = config.staff_email || "staff@stocktrack.com";
    const staffPassword = config.staff_password || "staff123";
    const staffName = config.staff_name || "Store Staff";

    const isStaffExist = await prisma.user.findUnique({
      where: {
        email: staffEmail,
      },
    });

    if (isStaffExist) {
      console.log("Staff User Already Exists!");
      return;
    }

    const hashedPassword = await bcrypt.hash(
      staffPassword,
      Number(config.bcrypt_salt_rounds) || 10,
    );

    const staff = await prisma.user.create({
      data: {
        name: staffName,
        email: staffEmail,
        password: hashedPassword,
        role: Role.STAFF,
        isActive: true,
      },
    });

    console.log("Staff User Created Successfully: ", staff.email);
  } catch (error) {
    console.log("Error Seeding Staff User: ", error);
  }
};
