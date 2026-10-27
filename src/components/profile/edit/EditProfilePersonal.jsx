
import React, { memo } from "react";

import {
    CalendarDays,
    FileText,
    Mail,
    MapPin,
    UserRound,
} from "lucide-react";

import EditProfileField from "./EditProfileField";
import EditProfileSection from "./EditProfileSection";

// ============================================================
// LOCAL DATE
// ============================================================

const getTodayForDateInput = () => {
    const now = new Date();

    const year = now.getFullYear();

    const month = String(
        now.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
        now.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
};

// ============================================================
// PERSONAL INFORMATION
// ============================================================

const EditProfilePersonal = memo(function EditProfilePersonal({
    formData = {},
    onChange,
    onBlur,
    loading = false,
    fieldErrors = {},
}) {
    const today = getTodayForDateInput();

    return (
        <EditProfileSection
            Icon={UserRound}
            code="IDENTITY / PERSONAL"
            title="Shaxsiy ma’lumotlar"
            description="Profilingizning asosiy ma’lumotlarini yangilang."
            columns={2}
        >
            {/* ==============================================
                FIRST NAME
            =============================================== */}

            <EditProfileField
                name="first_name"
                label="Ism"
                Icon={UserRound}
                type="text"
                value={formData.first_name ?? ""}
                onChange={onChange}
                onBlur={onBlur}
                disabled={loading}
                error={fieldErrors.first_name}
                placeholder="Ismingiz"
                autoComplete="given-name"
                maxLength={150}
            />

            {/* ==============================================
                LAST NAME
            =============================================== */}

            <EditProfileField
                name="last_name"
                label="Familiya"
                Icon={UserRound}
                type="text"
                value={formData.last_name ?? ""}
                onChange={onChange}
                onBlur={onBlur}
                disabled={loading}
                error={fieldErrors.last_name}
                placeholder="Familiyangiz"
                autoComplete="family-name"
                maxLength={150}
            />

            {/* ==============================================
                EMAIL
            =============================================== */}

            <EditProfileField
                name="email"
                label="Email"
                Icon={Mail}
                type="email"
                value={formData.email ?? ""}
                onChange={onChange}
                onBlur={onBlur}
                disabled={loading}
                error={fieldErrors.email}
                placeholder="example@gmail.com"
                autoComplete="email"
                inputMode="email"
                maxLength={254}
                hint="Profil va tizim xabarlari uchun ishlatiladi."
                className="md:col-span-2"
            />

            {/* ==============================================
                BIRTHDAY
            =============================================== */}

            <EditProfileField
                name="birthday"
                label="Tug‘ilgan sana"
                Icon={CalendarDays}
                type="date"
                value={formData.birthday ?? ""}
                onChange={onChange}
                onBlur={onBlur}
                disabled={loading}
                error={fieldErrors.birthday}
                max={today}
            />

            {/* ==============================================
                ADDRESS
            =============================================== */}

            <EditProfileField
                name="address"
                label="Manzil"
                Icon={MapPin}
                type="text"
                value={formData.address ?? ""}
                onChange={onChange}
                onBlur={onBlur}
                disabled={loading}
                error={fieldErrors.address}
                placeholder="Masalan: Urganch, Uzbekistan"
                autoComplete="address-level2"
            />

            {/* ==============================================
                ABOUT ME
            =============================================== */}

            <EditProfileField
                name="about_me"
                label="Men haqimda"
                Icon={FileText}
                control="textarea"
                value={formData.about_me ?? ""}
                onChange={onChange}
                onBlur={onBlur}
                disabled={loading}
                error={fieldErrors.about_me}
                placeholder={
                    "O‘zingiz haqingizda, tajribangiz " +
                    "va qiziqishlaringiz haqida yozing..."
                }
                rows={5}
                hint="Qiziqishlaringiz va tajribangizni qisqacha tasvirlang."
                className="md:col-span-2"
            />
        </EditProfileSection>
    );
});

export default EditProfilePersonal;
