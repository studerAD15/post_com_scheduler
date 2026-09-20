/**
 * App.tsx - Root Application Orchestrator & Screen Switcher.
 *
 * ARCHITECTURAL ROLE:
 * 1. Authentication Gate: If unauthenticated, displays the themed `<LoginForm />`.
 *    Once logged in with a valid JWT, mounts `<MainLayout />`.
 * 2. Active Tab Management: Controls switching between views:
 *    - "composer": Post composition and platform preview (Editor only).
 *    - "feed": All published and scheduled posts list.
 *    - "drafts": Saved drafts and revision audit trails.
 *    - "calendar": Drag-and-drop interactive scheduling calendar.
 *    - "analytics": Aggregated telemetry KPIs and platform distribution.
 *    - "activity": Security activity audit log (Admin only).
 * 3. Role-Based Navigation Guards:
 *    - Non-editors (Admin, Viewer) lack `create_post` and are redirected away from "composer".
 *    - Non-admins lack `view_activity_log` and cannot view "activity".
 * 4. Cross-Tab Synchronization: Listens to window storage events to keep state synced across tabs.
 */

import React, { useEffect, useState, useCallback } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "./hooks";
import {
  selectIsAuthenticated,
  checkTokenExpiration,
  selectCurrentUser,
} from "./features/auth/authSlice";
import { LoginForm } from "./features/auth/LoginForm";
import { MainLayout } from "./components/layout/MainLayout";
import { PostComposer } from "./features/posts/PostComposer";
import { PostList } from "./features/posts/PostList";
import { FeedSidebar } from "./features/posts/FeedSidebar";
import { DraftList } from "./features/drafts/DraftList";
import { ScheduleCalendar } from "./features/schedule/ScheduleCalendar";
import { CalendarView } from "./features/schedule/CalendarView";
import { AnalyticsOverview } from "./features/posts/AnalyticsOverview";
import { ScheduleModal } from "./features/schedule/ScheduleModal";
import { UnauthorizedView } from "./components/layout/UnauthorizedView";
import {
  fetchPosts,
  addPostThunk,
  schedulePostThunk,
  publishPostThunk,
  deletePostThunk,
  clearFeedback,
  selectPostsStatus,
} from "./features/posts/postsSlice";
import { ErrorBoundary } from "./components/common/ErrorBoundary";
import {
  fetchDraftsThunk,
  saveDraftThunk,
  deleteDraftThunk,
  clearDraftsError,
  selectAllDrafts,
  selectDraftsStatus,
} from "./features/drafts/draftsSlice";
import { selectUpcomingScheduledPosts } from "./features/posts/postsSelectors";
import { STORAGE_PREFIX } from "./utils/storage";
import { Draft } from "./types/draft";
import { Post } from "./types/post";
import { PlatformId } from "./types/platform";
import { CheckCircle2, Edit3, AlertCircle } from "lucide-react";
import { OmnitrixOverlay } from "./components/omnitrix/OmnitrixOverlay";
import { OmnitrixCursor } from "./components/omnitrix/OmnitrixCursor";

import { usePermission } from "./features/auth/usePermission";
import { ActivityLogView } from "./features/activity/ActivityLogView";
import { AssistantWidget } from "./features/assistant/AssistantWidget";

export function AppContent() {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectCurrentUser);
  const feedbackMessage = useAppSelector((state) => state.posts.feedbackMessage);
  const postsError = useAppSelector((state) => state.posts.error);
  const draftsError = useAppSelector((state) => state.drafts.error);
  const upcomingScheduled = useAppSelector(selectUpcomingScheduledPosts);
  const drafts = useAppSelector(selectAllDrafts);
  const draftsStatus = useAppSelector(selectDraftsStatus);
  const isDraftsLoading = draftsStatus === "loading";
  const postsStatus = useAppSelector(selectPostsStatus);
  const isPostsLoading = postsStatus === "loading";
  const isSubmitting = isPostsLoading || isDraftsLoading;

  const canCreate = usePermission("create_post");

  const [activeTab, setActiveTab] = useState<
    "composer" | "feed" | "drafts" | "calendar" | "analytics" | "activity"
  >(() => (user?.role === "editor" ? "composer" : user?.role === "admin" ? "activity" : "analytics"));

  // Ensure non-editors cannot land or stay on Composer tab
  useEffect(() => {
    if (!canCreate && activeTab === "composer") {
      setActiveTab(user?.role === "admin" ? "activity" : "analytics");
    } else if (user?.role !== "admin" && activeTab === "activity") {
      setActiveTab(user?.role === "viewer" ? "analytics" : "feed");
    }
  }, [user?.role, canCreate, activeTab]);

  // State for editing a draft/post inside composer
  const [editingDraft, setEditingDraft] = useState<Draft | null>(null);

  // State for Schedule Modal
  const [scheduleTargetPost, setScheduleTargetPost] = useState<{
    id?: string;
    title: string;
    content: string;
    platforms: PlatformId[];
    media: any[];
  } | null>(null);

  // Check token expiration once on initial app boot
  useEffect(() => {
    dispatch(checkTokenExpiration());
  }, [dispatch]);

  // Fetch initial posts and drafts when authenticated & handle cross-tab storage sync
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchPosts());
      dispatch(fetchDraftsThunk());
    }

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key && e.key.startsWith(STORAGE_PREFIX) && isAuthenticated) {
        if (e.key.includes("posts")) {
          dispatch(fetchPosts());
        }
        if (e.key.includes("drafts")) {
          dispatch(fetchDraftsThunk());
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [dispatch, isAuthenticated]);

  // Clear feedback notification banner
  useEffect(() => {
    if (feedbackMessage) {
      const timer = setTimeout(() => dispatch(clearFeedback()), 4000);
      return () => clearTimeout(timer);
    }
  }, [feedbackMessage, dispatch]);

  const handleSaveDraft = useCallback(
    (postData: {
      title: string;
      content: string;
      platforms: PlatformId[];
      media: any[];
    }) => {
      dispatch(
        saveDraftThunk({
          title: postData.title,
          content: postData.content,
          platforms: postData.platforms,
          media: postData.media,
          status: "draft",
          scheduledAt: null,
        })
      );
      setActiveTab("drafts");
    },
    [dispatch]
  );

  const handlePublishDirect = useCallback(
    (postData: {
      title: string;
      content: string;
      platforms: PlatformId[];
      media: any[];
    }) => {
      dispatch(
        addPostThunk({
          title: postData.title,
          content: postData.content,
          platforms: postData.platforms,
          media: postData.media,
          status: "published",
        })
      );
      setEditingDraft(null);
      setActiveTab("feed");
    },
    [dispatch]
  );

  const handleOpenScheduleFromComposer = useCallback(
    (postData: {
      title: string;
      content: string;
      platforms: PlatformId[];
      media: any[];
      scheduledAt: string;
    }) => {
      setScheduleTargetPost({
        title: postData.title,
        content: postData.content,
        platforms: postData.platforms,
        media: postData.media,
      });
    },
    []
  );

  const handleOpenScheduleFromFeed = useCallback((post: Post) => {
    setScheduleTargetPost({
      id: post.id,
      title: post.title,
      content: post.content,
      platforms: post.platforms,
      media: post.media,
    });
  }, []);

  const handleConfirmScheduleDate = useCallback(
    (scheduledIsoString: string) => {
      if (!scheduleTargetPost) return;

      if (scheduleTargetPost.id) {
        dispatch(
          schedulePostThunk({
            id: scheduleTargetPost.id,
            scheduledAt: scheduledIsoString,
          })
        );
      } else {
        dispatch(
          addPostThunk({
            title: scheduleTargetPost.title,
            content: scheduleTargetPost.content,
            platforms: scheduleTargetPost.platforms,
            media: scheduleTargetPost.media,
            status: "scheduled",
            scheduledAt: scheduledIsoString,
          })
        );
      }

      setScheduleTargetPost(null);
      setEditingDraft(null);
      setActiveTab("calendar");
    },
    [dispatch, scheduleTargetPost]
  );

  const handleEditDraftInComposer = useCallback((draft: Draft) => {
    setEditingDraft(draft);
    setActiveTab("composer");
  }, []);

  const handleDeleteDraft = useCallback(
    (draftId: string) => {
      dispatch(deleteDraftThunk(draftId));
    },
    [dispatch]
  );

  const handleCloseScheduleModal = useCallback(() => {
    setScheduleTargetPost(null);
  }, []);

  const handleClearEditingDraft = useCallback(() => {
    setEditingDraft(null);
  }, []);

  const handleCreateNewDraft = useCallback(() => {
    setEditingDraft(null);
    setActiveTab("composer");
  }, []);

  const handleDismissFeedback = useCallback(() => {
    dispatch(clearFeedback());
  }, [dispatch]);

  const handleDismissErrors = useCallback(() => {
    dispatch(clearFeedback());
    dispatch(clearDraftsError());
  }, [dispatch]);

  const handlePublishNow = useCallback(
    (postId: string) => {
      dispatch(publishPostThunk(postId));
    },
    [dispatch]
  );

  const handleDeletePost = useCallback(
    (postId: string) => {
      dispatch(deletePostThunk(postId));
    },
    [dispatch]
  );

  const handleEditPostFromCalendar = useCallback((post: Post) => {
    setEditingDraft({
      id: post.id,
      title: post.title,
      content: post.content,
      platforms: post.platforms,
      media: post.media,
      status: post.status,
      scheduledAt: post.scheduledAt,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    });
    setActiveTab("composer");
  }, []);

  const handleReschedulePostFromCalendar = useCallback((post: Post) => {
    setScheduleTargetPost({
      id: post.id,
      title: post.title,
      content: post.content,
      platforms: post.platforms,
      media: post.media,
    });
  }, []);

  const handleCreatePostForDateFromCalendar = useCallback((dateStr: string) => {
    setScheduleTargetPost({
      title: "",
      content: "",
      platforms: ["twitter", "linkedin"],
      media: [],
    });
  }, []);

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return (
    <MainLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {/* Toast Feedback Notification Banner */}
      {feedbackMessage && (
        <div className="bg-[#FFFFFF] border-2 border-[#0A0A0A] border-l-8 border-l-[#3DDC10] p-4 rounded-sm text-[#0A0A0A] text-xs font-space font-extrabold uppercase tracking-wider flex items-center justify-between shadow-card-white animate-slide-up">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#3DDC10]" /> {feedbackMessage}
          </span>
          <button
            type="button"
            onClick={handleDismissFeedback}
            aria-label="Dismiss notification"
            className="text-[#0A0A0A] hover:text-[#3DDC10] text-base font-bold px-1"
          >
            ×
          </button>
        </div>
      )}

      {/* Error Notification Banner */}
      {(postsError || draftsError) && (
        <div className="bg-[#FFFFFF] border-2 border-[#0A0A0A] border-l-8 border-l-[#FF4D4D] p-4 rounded-sm text-[#0A0A0A] text-xs font-space font-extrabold uppercase tracking-wider flex items-center justify-between shadow-card-white animate-slide-up">
          <span className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-[#FF4D4D]" /> {postsError || draftsError}
          </span>
          <button
            type="button"
            onClick={handleDismissErrors}
            aria-label="Dismiss error notification"
            className="text-[#0A0A0A] hover:text-[#FF4D4D] text-base font-bold px-1"
          >
            ×
          </button>
        </div>
      )}

      {/* Main Tab Views */}
      {activeTab === "composer" && (
        <div className="space-y-4">
          {editingDraft && (
            <div className="bg-[#FFFFFF] border-2 border-[#0A0A0A] border-l-8 border-l-[#3DDC10] p-3.5 rounded-sm text-xs text-[#0A0A0A] font-space flex items-center justify-between shadow-card-white">
              <span className="flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-[#3DDC10]" /> EDITING SAVED DRAFT:{" "}
                <strong className="text-[#0A0A0A]">{editingDraft.title || "Untitled Post"}</strong>
              </span>
              <button
                type="button"
                onClick={handleClearEditingDraft}
                className="text-xs font-rajdhani font-bold underline hover:text-[#3DDC10] uppercase"
              >
                Clear / Create Blank Post
              </button>
            </div>
          )}
          <PostComposer
            key={editingDraft ? editingDraft.id : "new-composer"}
            initialTitle={editingDraft ? editingDraft.title : ""}
            initialContent={editingDraft ? editingDraft.content : ""}
            initialPlatforms={editingDraft ? editingDraft.platforms : ["twitter", "linkedin"]}
            initialMedia={editingDraft ? editingDraft.media : []}
            onSaveDraft={handleSaveDraft}
            onPublish={handlePublishDirect}
            onSchedule={handleOpenScheduleFromComposer}
            isSubmitting={isSubmitting}
          />
        </div>
      )}

      {activeTab === "feed" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-2 space-y-6">
            <PostList onOpenScheduleModal={handleOpenScheduleFromFeed} />
          </div>
          <div className="lg:col-span-1">
            <FeedSidebar
              onNavigateTab={setActiveTab}
              onOpenScheduleModal={handleOpenScheduleFromFeed}
            />
          </div>
        </div>
      )}

      {activeTab === "drafts" && (
        <DraftList
          drafts={drafts}
          isLoading={isDraftsLoading}
          onEditDraft={handleEditDraftInComposer}
          onDeleteDraft={handleDeleteDraft}
          onCreateNew={handleCreateNewDraft}
        />
      )}

      {activeTab === "calendar" && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 space-y-6">
            <CalendarView
              onPublishNow={handlePublishNow}
              onEditPost={handleEditPostFromCalendar}
              onReschedulePost={handleReschedulePostFromCalendar}
              onDeletePost={handleDeletePost}
              onCreatePostForDate={handleCreatePostForDateFromCalendar}
            />
          </div>
          <div className="space-y-6">
            <ScheduleCalendar
              scheduledPosts={upcomingScheduled}
              onPublishNow={handlePublishNow}
            />
          </div>
        </div>
      )}

      {activeTab === "analytics" && <AnalyticsOverview />}

      {activeTab === "activity" && <ActivityLogView />}

      {/* Schedule Modal */}
      <ScheduleModal
        isOpen={Boolean(scheduleTargetPost)}
        onClose={handleCloseScheduleModal}
        onConfirmSchedule={handleConfirmScheduleDate}
        postTitle={scheduleTargetPost?.title}
        platforms={scheduleTargetPost?.platforms}
      />
    </MainLayout>
  );
}

export function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <OmnitrixOverlay />
        <OmnitrixCursor />
        <Routes>
          <Route path="/unauthorized" element={<UnauthorizedView />} />
          <Route path="/*" element={<AppContent />} />
        </Routes>
        <AssistantWidget />
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
