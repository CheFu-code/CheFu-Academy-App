import { Likes } from "@/types/sparks";

export const handleLike = async (sparkId: string, likes: Likes[] = []) => {
    if (!userDetail) return;

    // ⛔ prevent double tap
    if (likeLock === sparkId) return;
    setLikeLock(sparkId);

    try {
        const sparkRef = doc(db, 'sparks', sparkId);
        const sparkSnap = await getDoc(sparkRef);
        const sparkData = sparkSnap.data();

        if (!sparkData) return;

        const existingLike = likes.find(
            (like) => like.createdBy.uid === userDetail?.uid,
        );

        if (existingLike) {
            // Unlike → remove
            await updateDoc(sparkRef, {
                likes: arrayRemove(existingLike),
            });
        } else {
            // Like → add new object
            const newLike: Likes = {
                id: userDetail?.uid,
                text: 'Liked',
                createdBy: {
                    uid: userDetail?.uid,
                    fullname: userDetail?.fullname || 'Anonymous',
                    profilePicture: userDetail?.profilePicture || '',
                },
                createdAt: Timestamp.now(),
            };

            await updateDoc(sparkRef, {
                likes: arrayUnion(newLike),
            });

            // Send notification if not liking own spark
            if (
                sparkData.createdBy?.uid !== userDetail?.uid &&
                sparkData.createdBy?.email
            ) {
                await addDoc(collection(db, 'notifications'), {
                    type: 'like',
                    sparkId,
                    from: {
                        uid: userDetail?.uid,
                        fullname: userDetail?.fullname || 'Anonymous',
                    },
                    to: sparkData.createdBy?.uid,
                    message: `${
                        userDetail?.fullname || 'Someone'
                    } liked your spark.`,
                    createdAt: Timestamp.now(),
                    read: false,
                });
            }

            await sendNotification(
                sparkData.createdBy?.email,
                'New Like',
                `${userDetail?.fullname || 'Someone'} liked your spark.`,
            );
        }
    } catch (e) {
        console.log('Like error:', e);
    } finally {
        // 🔓 Unlock after Firestore completes
        setLikeLock(null);
    }
};