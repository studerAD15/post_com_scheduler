/**
 * App.tsx - Root Application component with Tri-Color Balance & 5 Google Fonts.
 * Features automatic cross-tab Local Storage synchronization and ApiError toast banners.
 */

import React, { useEffect, useState } from "react";
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
import { DraftList } from "./features/drafts/DraftList";
import { ScheduleCalendar } from "./features/schedule/ScheduleCalendar";
import { AnalyticsOverview } from "./features/posts/AnalyticsOverview";
import { ScheduleModal } from "./features/schedule/ScheduleModal";
import { UnauthorizedView } from "./components/layout/UnauthorizedView";
import {
  fetchPosts,
  addPostThunk,
  schedulePostThunk,
  clearFeedback,
} from "./features/posts/postsSlice";
import {
  fetchDraftsThunk,
  saveDraftThunk,
  deleteDraftThunk,
  clearDraftsError,
} from "./features/drafts/draftsSlice";
import { selectUpcomingScheduledPosts } from "./features/posts/postsSelectors";
import { STORAGE_PREFIX } from "./utils/storage";
import { Draft } from "./types/draft";
import { Post } from "./types/post";
import { PlatformId } from "./types/platform";
import { CheckCircle2, Edit3, AlertCircle } from "lucide-react";

export function AppContent() {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectCurrentUser);
  const feedbackMessage = useAppSelector((state) => state.posts.feedbackMessage);
  const postsError = useAppSelector((state) => state.posts.error);
  const draftsError = useAppSelector((state) => state.drafts.error);
  const upcomingScheduled = useAppSelector(selectUpcomingScheduledPosts);
  const drafts = useAppSelector((state) => state.drafts.items);
  const isDraftsLoading = useAppSelector((state) => state.drafts.status === "loading");

  const [activeTab, setActiveTab] = useState<
    "composer" | "feed" | "drafts" | "calendar" | "analytics"
  >("composer");

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

  // Boot up initial data fetching & cross-tab Local Storage sync
  useEffect(() => {
    dispatch(checkTokenExpiration());
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

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  const handleSaveDraft = (postData: {
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
  };

  const handlePublishDirect = (postData: {
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
  };

  const handleOpenScheduleFromComposer = (postData: {
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
  };

  const handleOpenScheduleFromFeed = (post: Post) => {
    setScheduleTargetPost({
      id: post.id,
      title: post.title,
      content: post.content,
      platforms: post.platforms,
      media: post.media,
    });
  };

  const handleConfirmScheduleDate = (scheduledIsoString: string) => {
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
  };

  const handleEditDraftInComposer = (draft: Draft) => {
    setEditingDraft(draft);
    setActiveTab("composer");
  };

  const handleDeleteDraft = (draftId: string) => {
    dispatch(deleteDraftThunk(draftId));
  };

  return (
    <MainLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {/* Toast Feedback Notification Banner */}
      {feedbackMessage && (
        <div className="bg-[#FFFFFF] border-2 border-[#0A0A0A] border-l-8 border-l-[#3DDC10] p-4 rounded-sm text-[#0A0A0A] text-xs font-space font-extrabold uppercase tracking-wider flex items-center justify-between shadow-card-white animate-slide-up">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#3DDC10]" /> {feedbackMessage}
          </span>
          <button
            onClick={() => dispatch(clearFeedback())}
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
            onClick={() => {
              dispatch(clearFeedback());
              dispatch(clearDraftsError());
            }}
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
                onClick={() => setEditingDraft(null)}
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
          />
        </div>
      )}

      {activeTab === "feed" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <PostList onOpenScheduleModal={handleOpenScheduleFromFeed} />
          </div>
          <div className="space-y-6">
            <AnalyticsOverview />
          </div>
        </div>
      )}

      {activeTab === "drafts" && (
        <DraftList
          drafts={drafts}
          isLoading={isDraftsLoading}
          onEditDraft={handleEditDraftInComposer}
          onDeleteDraft={handleDeleteDraft}
          onCreateNew={() => {
            setEditingDraft(null);
            setActiveTab("composer");
          }}
        />
      )}

      {activeTab === "calendar" && (
        <ScheduleCalendar scheduledPosts={upcomingScheduled} />
      )}

      {activeTab === "analytics" && <AnalyticsOverview />}

      {/* Schedule Modal */}
      <ScheduleModal
        isOpen={Boolean(scheduleTargetPost)}
        onClose={() => setScheduleTargetPost(null)}
        onConfirmSchedule={handleConfirmScheduleDate}
        postTitle={scheduleTargetPost?.title}
        platforms={scheduleTargetPost?.platforms}
      />
    </MainLayout>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/unauthorized" element={<UnauthorizedView />} />
        <Route path="/*" element={<AppContent />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
