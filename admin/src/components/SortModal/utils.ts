const ellipsis = (str: string, num: number = str.length, ellipsisStr = '...') =>
  str.length >= num
    ? str.slice(0, num >= ellipsisStr.length ? num - ellipsisStr.length : num) + ellipsisStr
    : str;

export function getSubtitle(
  entry: any,
  subTitleField: string,
  titleField: string,
  ellipsisCount?: number
) {
  try {
    if (subTitleField && entry[subTitleField]) {
      if (entry[subTitleField].constructor.name == 'Array') {
        if (entry[subTitleField].length > 0) {
          return ellipsis(entry[subTitleField][0][titleField], ellipsisCount ?? 500);
        }
      } else if (typeof entry[subTitleField] === 'object') {
        return ellipsis(entry[subTitleField][titleField] ?? '', ellipsisCount ?? 500);
      } else {
        return ellipsis(String(entry[subTitleField]), ellipsisCount ?? 500);
      }
    }

    return '';
  } catch (e) {
    console.warn('Unsupported subtitle field value.', e);
    return '';
  }
}

export function getTitle(entry: any, titleField: string, ellipsisCount?: number) {
  return ellipsis(entry[titleField]?.toString() ?? '', ellipsisCount ?? 200);
}
