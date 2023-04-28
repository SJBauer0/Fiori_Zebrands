const db = require('../database/db');
const jsonsql = require('jsonsql');

module.exports = class StatusIssue {
  constructor(id, status) {
    this.id = id;
    this.status = status;
  }

  static fetchAll = async () => {
    try {
      const [rows] = await db.execute('SELECT * FROM status_issues');
      return rows;
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  static getIssuesBySprints(ids) {
    const placeholders = Array(ids.length).fill('?').join(',');
    const sql = `
      SELECT 
        i.status,
        COUNT(*) AS total
      FROM 
        issues i
      JOIN 
        sprints_issues si ON i.clave = si.id_issue
      WHERE 
        i.status IN ('Done', 'Pull request', 'To Do', 'En curso')
        AND si.id_sprint IN (${placeholders})
      GROUP BY 
        i.status;
    `;
    return db.execute(sql, ids);
  }

  static getIssuesByStoryPoints(ids) {
    const placeholders = Array(ids.length).fill('?').join(',');
    const sql = `
    SELECT i.status, SUM(i.story_points) AS total_story_points
    FROM issues i
    JOIN sprints_issues isp ON i.clave = isp.id_issue
    JOIN sprints ts ON ts.id_jira = isp.id_sprint
    WHERE ts.id_jira IN (${placeholders})
    GROUP BY i.status;
    `;
    return db.execute(sql, ids);
  }

  //the next method returns the status of the issues assigned to the logged in user depending to the selected sprint
  static getIssuesByUser(id, ids) {
    const placeholders = Array(ids.length).fill('?').join(',');
    const sql = `

    `;
    return db.execute(
      `
      SELECT i.status, COUNT(*) AS total
      FROM issues i, sprints s, sprints_issues si
      WHERE i.clave = si.id_issue 
      AND si.id_sprint = s.id_jira
      AND i.assignee_id = ?
      AND s.id_jira IN (${placeholders})
      GROUP BY i.status
    `,
      [id, ...ids]
    );
  }

  static getIssuesByUserSolo(id) {
    const sql = `
    SELECT i.status, COUNT(*) AS total
    FROM issues i
    WHERE i.status IN ("Done", "To Do", "En Curso")
    AND i.assignee_id = ?
    GROUP BY i.status
    `;
    return db.execute(sql, [id]);
  }

  //the next method returns the story points of the issues assigned to the logged in user in two groups: done and not done
  static getStoryPointsByUser(id, ids) {
    const placeholders = Array(ids.length).fill('?').join(',');
    const sql = `
    SELECT i.status, SUM(i.story_points) AS total_story_points
    FROM issues i, sprints s, sprints_issues si
    WHERE i.clave = si.id_issue
    AND si.id_sprint = s.id_jira
    AND i.assignee_id = ?
    AND s.id_jira IN (${placeholders})
    GROUP BY i.status;
    `;
    return db.execute(sql, [id, ...ids]);
  }

  static getStoryPointsByUserSolo(id) {
    const sql = `
    SELECT i.status, SUM(i.story_points) AS total_story_points
    FROM issues i
    WHERE i.assignee_id = ?
    GROUP BY i.status;
    `;
    return db.execute(sql, [id]);
  }

  static getIssuesByEpic(id) {
    return db.execute(
      `
      SELECT i.status, COUNT(*) AS total
      FROM issues i
      WHERE i.key_epic = ?
      AND i.status IN ("Done", "To Do", "En Curso")
      GROUP BY i.status
      `,
      [id]
    );
  }

  static getStoryPointsByEpic(id) {
    return db.execute(
      `
      SELECT i.status, SUM(i.story_points) AS total_story_points
      FROM issues i
      WHERE i.key_epic = ?
      GROUP BY i.status
      `,
      [id]
    );
  }

  //the next method returns the personal story points grouped from the last 5 sprints
  static getPersonalStoryPointsLastSprints(id) {
    return db.execute(
      `
      SELECT s.nombre, SUM(i.story_points) AS total_story_points
      FROM issues i, sprints s, sprints_issues si
      WHERE i.clave = si.id_issue
      AND si.id_sprint = s.id_jira
      AND i.assignee_id = ?
      AND i.status = "Done"
      GROUP BY s.nombre
      ORDER BY s.fecha_inicio ASC
      `,
      [id]
    );
  }

  static getPersonalToDoStoryPointsLastSprints(id) {
    return db.execute(
      `
      SELECT s.nombre, SUM(i.story_points) AS total_story_points
      FROM issues i, sprints s, sprints_issues si
      WHERE i.clave = si.id_issue
      AND si.id_sprint = s.id_jira
      AND i.assignee_id = ?
      AND i.status = "To Do"
      GROUP BY s.nombre
      ORDER BY s.fecha_inicio ASC
      `,
      [id]
    );
  }

  static getDoneStoryPointsLastSprints() {
    return db.execute(
      `
      SELECT s.nombre, SUM(i.story_points) AS total_story_points
      FROM issues i, sprints s, sprints_issues si
      WHERE i.clave = si.id_issue
      AND si.id_sprint = s.id_jira
      AND i.status = "Done"
      GROUP BY s.nombre
      ORDER BY s.fecha_inicio ASC
      `
    );
  }

  static getToDoStoryPointsLastSprints() {
    return db.execute(
      `
      SELECT s.nombre, SUM(i.story_points) AS total_story_points
      FROM issues i, sprints s, sprints_issues si
      WHERE i.clave = si.id_issue
      AND si.id_sprint = s.id_jira
      AND i.status = "To Do"
      GROUP BY s.nombre
      ORDER BY s.fecha_inicio ASC
      `
    );
  }

  static getDoneStoryPointsLastEpics() {
    return db.execute(
      `
      SELECT e.nombre, SUM(i.story_points) AS total_story_points
      FROM issues i, epics e
      WHERE i.key_epic = e.id_jira
      AND i.status = "Done"
      GROUP BY e.nombre
      ORDER BY e.id ASC
      `
    );
  }

  static getToDoStoryPointsLastEpics() {
    return db.execute(
      `
      SELECT e.nombre, SUM(i.story_points) AS total_story_points
      FROM issues i, epics e
      WHERE i.key_epic = e.id_jira
      AND i.status = "To Do"
      GROUP BY e.nombre
      ORDER BY e.id ASC
      `
    );
  }

  static getPersonalStoryPointsProgressiveLastSprints(id) {
    return db.execute(
      `
      SELECT s.nombre,
             (SELECT SUM(i2.story_points)
              FROM issues i2
              JOIN sprints_issues si2 ON i2.clave = si2.id_issue
              JOIN sprints s2 ON si2.id_sprint = s2.id_jira
              WHERE i2.assignee_id = ? AND i2.status = "Done"
                AND s2.fecha_inicio <= s.fecha_inicio) AS total_story_points
      FROM issues i
      JOIN sprints_issues si ON i.clave = si.id_issue
      JOIN sprints s ON si.id_sprint = s.id_jira
      WHERE i.assignee_id = ? AND i.status = "Done"
      GROUP BY s.id, s.nombre, s.fecha_inicio
      ORDER BY s.fecha_inicio ASC, s.nombre ASC;
      `,
      [id, id]
    );
  }

  static getPersonalToDoStoryPointsProgressiveLastSprints(id) {
    return db.execute(
      `
      SELECT s.nombre,
             (SELECT SUM(i2.story_points)
              FROM issues i2
              JOIN sprints_issues si2 ON i2.clave = si2.id_issue
              JOIN sprints s2 ON si2.id_sprint = s2.id_jira
              WHERE i2.assignee_id = ? AND i2.status = "To Do"
                AND s2.fecha_inicio <= s.fecha_inicio) AS total_story_points
      FROM issues i
      JOIN sprints_issues si ON i.clave = si.id_issue
      JOIN sprints s ON si.id_sprint = s.id_jira
      WHERE i.assignee_id = ? AND i.status = "To Do"
      GROUP BY s.id, s.nombre, s.fecha_inicio
      ORDER BY s.fecha_inicio ASC, s.nombre ASC;
      `,
      [id, id]
    );
  }

  static getDoneStoryPointsProgressiveLastSprints() {
    return db.execute(
      `
      SELECT s.nombre,
       (SELECT SUM(i2.story_points)
        FROM issues i2
        JOIN sprints_issues si2 ON i2.clave = si2.id_issue
        JOIN sprints s2 ON si2.id_sprint = s2.id_jira
        WHERE i2.status = "Done"
          AND s2.fecha_inicio <= s.fecha_inicio) AS total_story_points
      FROM issues i
      JOIN sprints_issues si ON i.clave = si.id_issue
      JOIN sprints s ON si.id_sprint = s.id_jira
      WHERE i.status = "Done"
      GROUP BY s.id, s.nombre, s.fecha_inicio
      ORDER BY s.fecha_inicio DESC, s.nombre DESC
      LIMIT 5;
      `
    );
  }

  static getToDoStoryPointsProgressiveLastSprints() {
    return db.execute(
      `
      SELECT s.nombre,
       (SELECT SUM(i2.story_points)
        FROM issues i2
        JOIN sprints_issues si2 ON i2.clave = si2.id_issue
        JOIN sprints s2 ON si2.id_sprint = s2.id_jira
        WHERE i2.status = "To Do"
          AND s2.fecha_inicio <= s.fecha_inicio) AS total_story_points
        FROM issues i
        JOIN sprints_issues si ON i.clave = si.id_issue
        JOIN sprints s ON si.id_sprint = s.id_jira
        WHERE i.status = "To Do"
        GROUP BY s.id, s.nombre, s.fecha_inicio
        ORDER BY s.fecha_inicio DESC, s.nombre DESC
        LIMIT 5;
      `
    );
  }

  static getDoneStoryPointsProgressiveLastEpics() {
    return db.execute(
      `
      SELECT e.nombre,
       (SELECT SUM(i2.story_points)
        FROM issues i2
        JOIN epics e2 ON i2.key_epic = e2.id_jira
        WHERE i2.status = "Done"
          AND e2.id <= e.id) AS total_story_points
FROM (
    SELECT DISTINCT e.*
    FROM epics e
    JOIN issues i ON i.key_epic = e.id_jira
    WHERE i.status = "Done"
    ORDER BY e.id DESC
    LIMIT 5
) AS e
JOIN issues i ON i.key_epic = e.id_jira
WHERE i.status = "Done"
GROUP BY e.id, e.nombre
ORDER BY e.id ASC, e.nombre ASC;


      `
    );
  }

  static getToDoStoryPointsProgressiveLastEpics() {
    return db.execute(
      `
      SELECT e.nombre,
       (SELECT SUM(i2.story_points)
        FROM issues i2
        JOIN epics e2 ON i2.key_epic = e2.id_jira
        WHERE i2.status = "To Do"
          AND e2.id <= e.id) AS total_story_points
FROM (
    SELECT DISTINCT e.*
    FROM epics e
    JOIN issues i ON i.key_epic = e.id_jira
    WHERE i.status = "To Do"
    ORDER BY e.id DESC
    LIMIT 5
) AS e
JOIN issues i ON i.key_epic = e.id_jira
WHERE i.status = "To Do"
GROUP BY e.id, e.nombre
ORDER BY e.id ASC, e.nombre ASC;

      `
    );
  }

  static getDoneEpicReport() {
    return db.execute(
      `
      SELECT e.nombre, SUM(i.story_points) AS total_story_points
      FROM issues i, epics e
      WHERE i.key_epic = e.id_jira
      AND e.id_jira IN ("TPECG-3911", "TPECG-3705", "TPECG-4013", "TPECG-32O2", "TPECG-3212")  
      and i.status = "Done"
      GROUP BY e.nombre
      ORDER BY e.id ASC
      `
    );
  }

  static getToDoEpicReport() {
    return db.execute(
      `
      SELECT e.nombre, SUM(i.story_points) AS total_story_points
      FROM issues i, epics e
      WHERE i.key_epic = e.id_jira
      AND e.id_jira IN ("TPECG-3911", "TPECG-3705", "TPECG-4013", "TPECG-32O2", "TPECG-3212")  
      and i.status = "To Do"
      GROUP BY e.nombre
      ORDER BY e.id ASC
      `
    );
  }
};
