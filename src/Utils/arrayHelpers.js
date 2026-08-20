export function isIdInArray(array, id) {
  if (!array) {
    return false;
  }

  for (let i = 0; i < array.length; i++) {
    const item = array[i];
    const itemId = typeof item === "string" ? item : item?._id;

    if (itemId === id) {
      return true;
    }
  }

  return false;
}

export function updatePostFields(postsList, postId, changes) {
  const updated = [];

  for (let i = 0; i < postsList.length; i++) {
    if (postsList[i]._id === postId) {
      updated.push({ ...postsList[i], ...changes });
    } else {
      updated.push(postsList[i]);
    }
  }

  return updated;
}

export function toggleIdInList(idsList, id) {
  const exists = isIdInArray(idsList, id);
  const updated = [];

  if (exists) {
    for (let i = 0; i < idsList.length; i++) {
      if (idsList[i] !== id) {
        updated.push(idsList[i]);
      }
    }
  } else {
    for (let i = 0; i < idsList.length; i++) {
      updated.push(idsList[i]);
    }
    updated.push(id);
  }

  return updated;
}
