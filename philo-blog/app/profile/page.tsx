"use client";

import { useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import LoadingScreen from "@/components/LoadingScreen";
import { useLanguage } from "@/contexts/LanguageProvider";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { Database } from "@/lib/supabase/types";
import {
  User as UserIcon,
  Lock,
  Settings,
  LogOut,
  Camera,
  Eye,
  EyeOff,
  CheckCircle2,
  XCircle,
  AlertCircle
} from "lucide-react";

type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];
type UserType = NonNullable<ProfileRow["user_type"]>;

export default function ProfilePage() {
  const router = useRouter();
  const { locale } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const copy = {
    kk: {
      missingSupabase: "Supabase орнатылмаған. .env.local тексеріңіз.",
      defaultUser: "Пайдаланушы",
      profileSaved: "Профиль сәтті сақталды",
      passwordChanged: "Құпиясөз сәтті өзгертілді",
      avatarUploadError: "Аватар жүктеу қатесі",
      avatarChanged: "Аватар сәтті өзгертілді",
      weak: "Әлсіз",
      medium: "Орташа",
      good: "Жақсы",
      strong: "Күшті",
      student: "Студент",
      teacher: "Оқытушы",
      profileInfo: "Профиль ақпарат",
      security: "Қауіпсіздік",
      adminPanel: "Админ панель",
      signOut: "Шығу",
      avatarAlt: "Профиль аватары",
      changeAvatar: "Аватарды өзгерту",
      avatarHint: "JPG, PNG, WEBP · Максимум 5MB",
      fullName: "Толық аты",
      email: "Email",
      emailLocked: "Email өзгертілмейді",
      role: "Рөліңіз",
      saving: "Сақталуда...",
      save: "САҚТАУ",
      setPassword: "Құпиясөз орнату",
      changePassword: "Құпиясөзді өзгерту",
      googleTitle: "Сіз Google арқылы кірдіңіз",
      googleText: "Email арқылы кіру үшін құпиясөз орнатыңыз",
      newPassword: "Жаңа құпиясөз",
      minPassword: "Кемінде 8 таңба",
      confirmPassword: "Құпиясөзді растаңыз",
      repeatPassword: "Құпиясөзді қайта енгізіңіз",
      passwordsMatch: "Құпиясөздер сәйкес",
      passwordsMismatch: "Құпиясөздер сәйкес емес",
      savePassword: "Құпиясөзді сақтау",
    },
    ru: {
      missingSupabase: "Supabase не настроен. Проверьте .env.local.",
      defaultUser: "Пользователь",
      profileSaved: "Профиль успешно сохранён",
      passwordChanged: "Пароль успешно изменён",
      avatarUploadError: "Ошибка загрузки аватара",
      avatarChanged: "Аватар успешно обновлён",
      weak: "Слабый",
      medium: "Средний",
      good: "Хороший",
      strong: "Сильный",
      student: "Студент",
      teacher: "Преподаватель",
      profileInfo: "Информация профиля",
      security: "Безопасность",
      adminPanel: "Админ панель",
      signOut: "Выйти",
      avatarAlt: "Аватар профиля",
      changeAvatar: "Изменить аватар",
      avatarHint: "JPG, PNG, WEBP · Максимум 5MB",
      fullName: "Полное имя",
      email: "Email",
      emailLocked: "Email нельзя изменить",
      role: "Ваша роль",
      saving: "Сохранение...",
      save: "СОХРАНИТЬ",
      setPassword: "Установить пароль",
      changePassword: "Изменить пароль",
      googleTitle: "Вы вошли через Google",
      googleText: "Установите пароль, чтобы входить по Email",
      newPassword: "Новый пароль",
      minPassword: "Минимум 8 символов",
      confirmPassword: "Подтвердите пароль",
      repeatPassword: "Повторите пароль",
      passwordsMatch: "Пароли совпадают",
      passwordsMismatch: "Пароли не совпадают",
      savePassword: "Сохранить пароль",
    },
    en: {
      missingSupabase: "Supabase is not configured. Check .env.local.",
      defaultUser: "User",
      profileSaved: "Profile saved successfully",
      passwordChanged: "Password updated successfully",
      avatarUploadError: "Avatar upload error",
      avatarChanged: "Avatar updated successfully",
      weak: "Weak",
      medium: "Medium",
      good: "Good",
      strong: "Strong",
      student: "Student",
      teacher: "Teacher",
      profileInfo: "Profile information",
      security: "Security",
      adminPanel: "Admin panel",
      signOut: "Sign out",
      avatarAlt: "Profile avatar",
      changeAvatar: "Change avatar",
      avatarHint: "JPG, PNG, WEBP · Maximum 5MB",
      fullName: "Full name",
      email: "Email",
      emailLocked: "Email cannot be changed",
      role: "Your role",
      saving: "Saving...",
      save: "SAVE",
      setPassword: "Set password",
      changePassword: "Change password",
      googleTitle: "You signed in with Google",
      googleText: "Set a password to sign in with email as well",
      newPassword: "New password",
      minPassword: "At least 8 characters",
      confirmPassword: "Confirm password",
      repeatPassword: "Re-enter your password",
      passwordsMatch: "Passwords match",
      passwordsMismatch: "Passwords do not match",
      savePassword: "Save password",
    },
  }[locale];

  const [activeTab, setActiveTab] = useState<"profile" | "security">("profile");

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const [fullName, setFullName] = useState("");
  const [userType, setUserType] = useState<UserType>("student");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [statusTextProfile, setStatusTextProfile] = useState<string | null>(null);
  const [statusTextSecurity, setStatusTextSecurity] = useState<string | null>(null);
  const [errorTextProfile, setErrorTextProfile] = useState<string | null>(null);
  const [errorTextSecurity, setErrorTextSecurity] = useState<string | null>(null);

  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();

    if (!supabase) {
      setErrorTextProfile(copy.missingSupabase);
      setLoading(false);
      return;
    }

    let isMounted = true;

    const loadUserAndProfile = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const currentUser = session?.user ?? null;

      if (!currentUser) {
        router.replace("/auth/login");
        return;
      }

      const { data: profileData } = await supabase
        .from("profiles")
        .select("id,full_name,avatar_url,user_type,role")
        .eq("id", currentUser.id)
        .maybeSingle();

      if (!isMounted) return;

      const metadataName =
        typeof currentUser.user_metadata?.full_name === "string"
          ? currentUser.user_metadata.full_name
          : typeof currentUser.user_metadata?.name === "string"
            ? currentUser.user_metadata.name
            : "";

      const oauthAvatar =
        typeof currentUser.user_metadata?.avatar_url === "string"
          ? currentUser.user_metadata.avatar_url
          : typeof currentUser.user_metadata?.picture === "string"
            ? currentUser.user_metadata.picture
            : null;

      setUser(currentUser);
      setFullName(profileData?.full_name ?? metadataName ?? "");
      setUserType(profileData?.user_type ?? "student");
      setAvatarUrl(profileData?.avatar_url ?? oauthAvatar);
      setIsAdmin(profileData?.role === "admin");
      setLoading(false);
    };

    void loadUserAndProfile();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      const nextUser = session?.user ?? null;

      if (!nextUser) {
        router.replace("/auth/login");
        return;
      }

      setUser(nextUser);
    });

    return () => {
      isMounted = false;
      authListener.subscription.unsubscribe();
    };
  }, [copy.missingSupabase, router]);

  const isGoogleUser = user?.app_metadata?.provider === "google";

  const displayInitial = useMemo(() => {
    const nameFromProfile = fullName.trim();

    if (nameFromProfile) {
      return nameFromProfile.charAt(0).toUpperCase();
    }

    const fallback = user?.email?.charAt(0) ?? "U";
    return fallback.toUpperCase();
  }, [fullName, user?.email]);

  const displayName = useMemo(() => {
    const normalizedName = fullName.trim().replace(/\s+/g, " ");

    if (normalizedName) {
      return normalizedName;
    }

    const emailPrefix = user?.email?.split("@")[0] ?? "";
    const cleanedEmailPrefix = emailPrefix.replace(/[._-]+/g, " ").trim();

    return cleanedEmailPrefix || copy.defaultUser;
  }, [copy.defaultUser, fullName, user?.email]);

  async function handleSaveProfile() {
    const supabase = getSupabaseBrowserClient();
    if (!supabase || !user) return;

    setErrorTextProfile(null);
    setStatusTextProfile(null);
    setIsSavingProfile(true);

    const payload = {
      id: user.id,
      full_name: fullName.trim() || null,
      avatar_url: avatarUrl,
      user_type: userType,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from("profiles")
      .upsert(payload as Database["public"]["Tables"]["profiles"]["Insert"], {
        onConflict: "id",
      });

    setIsSavingProfile(false);

    if (error) {
      setErrorTextProfile(error.message);
      return;
    }

    setStatusTextProfile(copy.profileSaved);

    window.dispatchEvent(
      new CustomEvent("profile:updated", {
        detail: {
          fullName: fullName.trim() || null,
          avatarUrl,
        },
      }),
    );

    setTimeout(() => setStatusTextProfile(null), 3000);
  }

  async function handlePasswordSave() {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    setErrorTextSecurity(null);
    setStatusTextSecurity(null);

    setIsSavingPassword(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setIsSavingPassword(false);

    if (error) {
      setErrorTextSecurity(error.message);
      return;
    }

    setNewPassword("");
    setConfirmPassword("");
    setStatusTextSecurity(copy.passwordChanged);
    setTimeout(() => setStatusTextSecurity(null), 3000);
  }

  async function handleAvatarChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile || !user) return;

    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    setErrorTextProfile(null);
    setStatusTextProfile(null);
    setIsUploadingAvatar(true);
    const previousAvatarUrl = avatarUrl;

    const ext = selectedFile.name.split(".").pop() ?? "jpg";
    const fileName = `avatar-${Date.now()}.${ext}`;
    const filePath = `${user.id}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, selectedFile, {
        upsert: true,
        contentType: selectedFile.type,
      });

    if (uploadError) {
      setIsUploadingAvatar(false);
      setErrorTextProfile(`${copy.avatarUploadError}: ${uploadError.message}`);
      return;
    }

    const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(filePath);
    const nextAvatarUrl = urlData.publicUrl;

    setAvatarUrl(nextAvatarUrl);

    const payload = {
      id: user.id,
      avatar_url: nextAvatarUrl,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from("profiles")
      .upsert(payload as Database["public"]["Tables"]["profiles"]["Insert"], {
        onConflict: "id",
      });

    setIsUploadingAvatar(false);

    if (error) {
      setAvatarUrl(previousAvatarUrl);
      setErrorTextProfile(error.message);
      return;
    }

    setStatusTextProfile(copy.avatarChanged);

    window.dispatchEvent(
      new CustomEvent("profile:updated", {
        detail: {
          avatarUrl: nextAvatarUrl,
          fullName: fullName.trim() || null,
        },
      }),
    );

    setTimeout(() => setStatusTextProfile(null), 3000);
  }

  async function handleSignOut() {
    const supabase = getSupabaseBrowserClient();
    if (supabase) {
      await supabase.auth.signOut();
      router.replace("/");
      router.refresh();
    }
  }

  const getStrengthBars = (pass: string) => {
    let strongCount = 0;
    if (pass.length >= 6) strongCount = 1;
    if (pass.length >= 8 && /\d/.test(pass)) strongCount = 2;
    if (pass.length >= 8 && /\d/.test(pass) && /[A-Z]/.test(pass)) strongCount = 3;
    if (pass.length >= 10 && /\d/.test(pass) && /[A-Z]/.test(pass) && /[^a-zA-Z0-9]/.test(pass)) strongCount = 4;
    return strongCount;
  };

  const strengthCount = getStrengthBars(newPassword);
  let strengthLabel = "";
  if (strengthCount === 1) strengthLabel = copy.weak;
  else if (strengthCount === 2) strengthLabel = copy.medium;
  else if (strengthCount === 3) strengthLabel = copy.good;
  else if (strengthCount === 4) strengthLabel = copy.strong;

  const strengthColor =
    strengthCount === 4
      ? "#22c55e"
      : strengthCount === 3
        ? "#f59e0b"
        : strengthCount >= 1
          ? "#ef4444"
          : "var(--color-border)";

  const isPasswordSaveDisabled =
    isSavingPassword || newPassword.length === 0 || newPassword !== confirmPassword || strengthCount < 2;

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) return null;

  return (
    <div className="mx-auto w-full max-w-[900px] px-[24px] py-[40px] flex flex-col md:flex-row gap-[24px] items-start relative z-0">
      
      {/* Left Sidebar */}
      <div className="w-full md:w-[260px] shrink-0 flex flex-col h-full md:min-h-[400px]">
        <div className="hidden md:flex flex-col items-center mb-[12px]">
          <div className="w-[80px] h-[80px] rounded-[22px] border-[3px] border-[color:var(--color-border)] overflow-hidden mx-auto mb-[12px] bg-[color:var(--color-surface-offset)] text-[color:var(--color-text)] flex items-center justify-center text-2xl font-bold">
            {avatarUrl ? (
              <Image
                src={avatarUrl || "/default-avatar.png"}
                alt={copy.avatarAlt}
                width={80}
                height={80}
                className="w-full h-full"
                style={{ borderRadius: "50%", objectFit: "cover" }}
              />
            ) : (
              displayInitial
            )}
          </div>
          <p className="font-ui text-[23px] font-semibold text-center leading-[1.18] mb-[6px] text-[color:var(--color-text)] max-w-[220px] break-words px-2">
            {displayName}
          </p>
          <p className="text-[12px] text-[color:var(--color-text-muted)] text-center mb-[12px] break-all px-2">
            {user.email}
          </p>
          <div className="flex justify-center mb-[20px]">
            <span className="text-[11px] px-[10px] py-[3px] rounded-full bg-[rgba(197,64,26,0.1)] text-[#C5401A] border border-[rgba(197,64,26,0.2)] text-center w-fit uppercase font-semibold">
              {userType === "student" ? copy.student : copy.teacher}
            </span>
          </div>
        </div>

        <div className="hidden md:block h-px bg-[color:var(--color-border)] w-full my-[16px]" />

        <nav className="flex flex-row md:flex-col gap-[4px] overflow-x-auto md:overflow-visible pb-2 md:pb-0 scrollbar-hide">
          <button
            onClick={() => setActiveTab("profile")}
            className="flex items-center gap-[10px] text-[14px] rounded-[8px] cursor-pointer transition-colors text-left shrink-0 mb-[4px]"
            style={{
              padding: activeTab === "profile" ? "10px 12px 10px 9px" : "10px 12px",
              backgroundColor: activeTab === "profile" ? "rgba(197,64,26,0.08)" : "transparent",
              color: activeTab === "profile" ? "#C5401A" : "var(--color-text-muted)",
              borderLeft: activeTab === "profile" ? "3px solid #C5401A" : "3px solid transparent",
              fontWeight: activeTab === "profile" ? 600 : 400,
            }}
            onMouseEnter={(e) => {
              if (activeTab !== "profile") {
                e.currentTarget.style.backgroundColor = "var(--color-surface-offset)";
                e.currentTarget.style.color = "var(--color-text)";
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== "profile") {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "var(--color-text-muted)";
              }
            }}
          >
            <UserIcon size={16} /> {copy.profileInfo}
          </button>

          <button
            onClick={() => setActiveTab("security")}
            className="flex items-center gap-[10px] text-[14px] rounded-[8px] cursor-pointer transition-colors text-left shrink-0 mb-[4px]"
            style={{
              padding: activeTab === "security" ? "10px 12px 10px 9px" : "10px 12px",
              backgroundColor: activeTab === "security" ? "rgba(197,64,26,0.08)" : "transparent",
              color: activeTab === "security" ? "#C5401A" : "var(--color-text-muted)",
              borderLeft: activeTab === "security" ? "3px solid #C5401A" : "3px solid transparent",
              fontWeight: activeTab === "security" ? 600 : 400,
            }}
            onMouseEnter={(e) => {
              if (activeTab !== "security") {
                e.currentTarget.style.backgroundColor = "var(--color-surface-offset)";
                e.currentTarget.style.color = "var(--color-text)";
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== "security") {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "var(--color-text-muted)";
              }
            }}
          >
            <Lock size={16} /> {copy.security}
          </button>

          {isAdmin && (
            <Link
              href="/admin"
              className="flex items-center gap-[10px] px-[12px] py-[10px] rounded-[8px] text-[14px] text-[color:var(--color-text-muted)] hover:bg-[color:var(--color-surface-offset)] hover:text-[color:var(--color-text)] shrink-0 border-l-[3px] border-transparent transition-colors mb-[4px]"
            >
              <Settings size={16} /> {copy.adminPanel}
            </Link>
          )}
        </nav>

        <div className="hidden md:block mt-auto pt-[24px]">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-start gap-[10px] py-[10px] px-[12px] text-[14px] rounded-[8px] border border-[color:var(--color-border)] bg-transparent text-[color:var(--color-text-muted)] cursor-pointer transition-colors"
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(197,64,26,0.06)";
              e.currentTarget.style.borderColor = "#C5401A";
              e.currentTarget.style.color = "#C5401A";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.borderColor = "var(--color-border)";
              e.currentTarget.style.color = "var(--color-text-muted)";
            }}
          >
            <LogOut size={16} /> {copy.signOut}
          </button>
        </div>
      </div>

      {/* Right Content */}
      <div className="flex-1 min-w-0 pb-[40px]">
        {activeTab === "profile" && (
          <div className="bg-[color:var(--color-surface)] border border-[color:var(--color-border)] rounded-[12px] py-[28px] px-[32px]">
            <p className="font-ui text-[32px] leading-[1.06] font-semibold mb-[24px] text-[color:var(--color-text)]">{copy.profileInfo}</p>
            
            {statusTextProfile && (
              <div className="bg-[#22c55e]/10 border border-[#22c55e]/30 text-[#15803d] rounded-[8px] px-4 py-3 text-[14px] mb-[24px] flex items-center gap-2">
                <CheckCircle2 size={16} color="#15803d" className="shrink-0" /> 
                {statusTextProfile}
              </div>
            )}
            {errorTextProfile && (
              <div className="bg-[rgba(197,64,26,0.08)] border border-[rgba(197,64,26,0.3)] text-[#C5401A] rounded-[8px] px-4 py-3 text-[14px] mb-[24px] flex items-center gap-2">
                <XCircle size={16} color="#C5401A" className="shrink-0" /> 
                {errorTextProfile}
              </div>
            )}

            <div className="flex items-center gap-[20px] mb-[28px] pb-[28px] border-b border-[color:var(--color-border)]">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingAvatar}
                className="w-[72px] h-[72px] rounded-[20px] border border-[color:var(--color-border)] overflow-hidden bg-[color:var(--color-surface-offset)] text-[color:var(--color-text)] flex items-center justify-center text-3xl font-bold shrink-0 cursor-pointer"
              >
                {avatarUrl ? (
                  <Image
                    src={avatarUrl || "/default-avatar.png"}
                    alt={copy.avatarAlt}
                    width={80}
                    height={80}
                    className="w-full h-full"
                    style={{ borderRadius: "50%", objectFit: "cover" }}
                  />
                ) : (
                  displayInitial
                )}
              </button>
              <div className="flex flex-col">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploadingAvatar}
                  className="flex items-center justify-center gap-[6px] py-[8px] px-[16px] border border-[color:var(--color-border)] rounded-[8px] text-[13px] bg-transparent cursor-pointer text-[color:var(--color-text)] hover:bg-[color:var(--color-surface-offset)] transition-colors disabled:opacity-50 w-fit"
                >
                  <Camera size={16} /> {copy.changeAvatar}
                </button>
                <p className="text-[11px] text-[color:var(--color-text-muted)] mt-[6px]">{copy.avatarHint}</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </div>
            </div>

            <div className="flex flex-col gap-[20px]">
              <div>
                <label className="block text-[11px] font-semibold tracking-[0.06em] uppercase text-[color:var(--color-text-muted)] mb-[6px] w-full">
                  {copy.fullName}
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="py-[10px] px-[14px] text-[14px] rounded-[8px] border border-[color:var(--color-border)] bg-[color:var(--color-bg)] text-[color:var(--color-text)] w-full focus:outline-none focus:border-[#C5401A] transition-all"
                  onFocus={(e) => (e.target.style.boxShadow = "0 0 0 3px rgba(197,64,26,0.1)")}
                  onBlur={(e) => (e.target.style.boxShadow = "none")}
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold tracking-[0.06em] uppercase text-[color:var(--color-text-muted)] mb-[6px] w-full">
                  {copy.email}
                </label>
                <input
                  type="email"
                  value={user.email ?? ""}
                  disabled
                  className="py-[10px] px-[14px] text-[14px] rounded-[8px] border border-[color:var(--color-border)] bg-[color:var(--color-surface-offset)] text-[color:var(--color-text-muted)] w-full cursor-not-allowed"
                />
                <p className="mt-[6px] text-[11px] text-[color:var(--color-text-muted)]">{copy.emailLocked}</p>
              </div>

              <div>
                <label className="block text-[11px] font-semibold tracking-[0.06em] uppercase text-[color:var(--color-text-muted)] mb-[6px] w-full">
                  {copy.role}
                </label>
                <div className="grid grid-cols-2 gap-[10px]">
                  <button
                    type="button"
                    onClick={() => setUserType("student")}
                    className="py-[10px] px-[16px] text-[14px] rounded-[8px] transition-colors border-[1.5px] cursor-pointer text-center outline-none"
                    style={{
                      borderColor: userType === "student" ? "#C5401A" : "var(--color-border)",
                      color: userType === "student" ? "#C5401A" : "var(--color-text-muted)",
                      backgroundColor: userType === "student" ? "rgba(197,64,26,0.06)" : "transparent",
                      fontWeight: userType === "student" ? 600 : 400,
                    }}
                  >
                    {copy.student}
                  </button>
                  <button
                    type="button"
                    onClick={() => setUserType("teacher")}
                    className="py-[10px] px-[16px] text-[14px] rounded-[8px] transition-colors border-[1.5px] cursor-pointer text-center outline-none"
                    style={{
                      borderColor: userType === "teacher" ? "#C5401A" : "var(--color-border)",
                      color: userType === "teacher" ? "#C5401A" : "var(--color-text-muted)",
                      backgroundColor: userType === "teacher" ? "rgba(197,64,26,0.06)" : "transparent",
                      fontWeight: userType === "teacher" ? 600 : 400,
                    }}
                  >
                    {copy.teacher}
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={handleSaveProfile}
                disabled={isSavingProfile}
                className="mt-[24px] w-full py-[12px] text-[15px] font-semibold bg-[#C5401A] text-white border-none rounded-[8px] cursor-pointer hover:bg-[#a33315] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSavingProfile ? copy.saving : copy.save}
              </button>
            </div>
          </div>
        )}

        {activeTab === "security" && (
          <div className="bg-[color:var(--color-surface)] border border-[color:var(--color-border)] rounded-[12px] py-[28px] px-[32px]">
            <p className="font-ui text-[32px] leading-[1.06] font-semibold mb-[24px] text-[color:var(--color-text)]">
              {isGoogleUser ? copy.setPassword : copy.changePassword}
            </p>

            {statusTextSecurity && (
              <div className="bg-[#22c55e]/10 border border-[#22c55e]/30 text-[#15803d] rounded-[8px] px-4 py-3 text-[14px] mb-[24px] flex items-center gap-2">
                <CheckCircle2 size={16} color="#15803d" className="shrink-0" /> 
                {statusTextSecurity}
              </div>
            )}
            {errorTextSecurity && (
              <div className="bg-[rgba(197,64,26,0.08)] border border-[rgba(197,64,26,0.3)] text-[#C5401A] rounded-[8px] px-4 py-3 text-[14px] mb-[24px] flex items-center gap-2">
                <XCircle size={16} color="#C5401A" className="shrink-0" /> 
                {errorTextSecurity}
              </div>
            )}

            {isGoogleUser && (
              <div className="bg-[rgba(197,64,26,0.06)] border border-[rgba(197,64,26,0.2)] rounded-[8px] p-[16px] mb-[24px] flex items-start gap-3">
                <AlertCircle size={16} color="#C5401A" className="shrink-0 mt-0.5" />
                <div>
                  <p className="text-[15px] font-medium text-[color:var(--color-text)] mb-1">
                    {copy.googleTitle}
                  </p>
                  <p className="text-[13px] text-[color:var(--color-text-muted)]">
                    {copy.googleText}
                  </p>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-[20px]">
              <div>
                <label className="block text-[11px] font-semibold tracking-[0.06em] uppercase text-[color:var(--color-text-muted)] mb-[6px] w-full">
                  {copy.newPassword}
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder={copy.minPassword}
                    className="py-[10px] px-[14px] text-[14px] pr-10 rounded-[8px] border border-[color:var(--color-border)] bg-[color:var(--color-bg)] text-[color:var(--color-text)] w-full focus:outline-none focus:border-[#C5401A] transition-all"
                    onFocus={(e) => (e.target.style.boxShadow = "0 0 0 3px rgba(197,64,26,0.1)")}
                    onBlur={(e) => (e.target.style.boxShadow = "none")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-[12px] top-1/2 -translate-y-1/2 text-[color:var(--color-text-muted)] hover:text-[color:var(--color-text)] transition-colors bg-transparent border-none cursor-pointer p-0 flex items-center justify-center"
                  >
                    {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                
                {/* Strength indicator */}
                <div className="mt-3 flex items-center gap-3">
                  <div className="flex gap-1.5 flex-1">
                    {[1, 2, 3, 4].map((level) => (
                      <div 
                        key={level} 
                        className="h-[4px] rounded-[2px] flex-1 transition-colors duration-300"
                        style={{
                          backgroundColor: strengthCount >= level ? strengthColor : "var(--color-border)"
                        }}
                      />
                    ))}
                  </div>
                  {newPassword.length > 0 && (
                    <span 
                      className="text-[12px] font-medium w-12 text-right"
                      style={{ color: strengthColor }}
                    >
                      {strengthLabel}
                    </span>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold tracking-[0.06em] uppercase text-[color:var(--color-text-muted)] mb-[6px] w-full">
                  {copy.confirmPassword}
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder={copy.repeatPassword}
                    className="py-[10px] px-[14px] text-[14px] pr-10 rounded-[8px] border border-[color:var(--color-border)] bg-[color:var(--color-bg)] text-[color:var(--color-text)] w-full focus:outline-none focus:border-[#C5401A] transition-all"
                    onFocus={(e) => (e.target.style.boxShadow = "0 0 0 3px rgba(197,64,26,0.1)")}
                    onBlur={(e) => (e.target.style.boxShadow = "none")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-[12px] top-1/2 -translate-y-1/2 text-[color:var(--color-text-muted)] hover:text-[color:var(--color-text)] transition-colors bg-transparent border-none cursor-pointer p-0 flex items-center justify-center"
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                {/* Match indicator */}
                {confirmPassword.length > 0 && (
                  <div 
                    className="mt-2 text-[13px] font-medium flex items-center gap-1.5"
                    style={{ color: newPassword === confirmPassword ? "#22c55e" : "#ef4444" }}
                  >
                    {newPassword === confirmPassword ? (
                      <><CheckCircle2 size={14} color="#22c55e" className="shrink-0" /> {copy.passwordsMatch}</>
                    ) : (
                      <><XCircle size={14} color="#ef4444" className="shrink-0" /> {copy.passwordsMismatch}</>
                    )}
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={handlePasswordSave}
                disabled={isPasswordSaveDisabled}
                className="mt-[24px] w-full py-[12px] text-[15px] font-semibold bg-[#C5401A] text-white border-none rounded-[8px] cursor-pointer hover:bg-[#a33315] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSavingPassword ? copy.saving : copy.savePassword}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
