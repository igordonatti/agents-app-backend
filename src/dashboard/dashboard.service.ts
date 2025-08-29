import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { N8nService } from 'src/n8n/n8n.service';
import {
  AgentsElevenLabs,
  Conversations,
} from './types/agentsElevenlabsInterface';

@Injectable()
export class DashboardService {
  private readonly devOrProd: boolean;

  constructor(
    private readonly n8nService: N8nService,
    private readonly configService: ConfigService,
  ) {
    this.devOrProd = this.configService.get('DEV_DECIDER');
  }

  async getDashboardData(id: string) {
    const workflowPath = `58bc66e5-606d-44e7-be6b-1278a97c9ec2${this.devOrProd === true ? '/dev' : ''}/agents/elevenlabs/${id}`;
    const data: AgentsElevenLabs =
      await this.n8nService.getResource(workflowPath);

    if (!data.conversations[0].conversation_id) {
      return {
        kpis: {},
        charts: {},
        conversations: [],
      };
    }

    const totalConversations = data.conversations.length;
    const averages = this.getAverageMinutesCall(data.conversations);
    const uniqueUserCount = this.getUniqueUsers(data.conversations);
    const successfulCallRate = this.getSuccessfulCallRate(data.conversations);
    const conversationsPerDay = this.getConversationsPerDay(data.conversations);
    const totalTimePerDay = this.getTotalTimePerDay(data.conversations);
    const distribuitionDuration = this.getDistribuitionDuration(
      data.conversations,
    );
    const heatmapHour = this.getHeatmapHour(data.conversations);
    const shortsConversations = this.getShortConversations(data.conversations);
    const successionDurate = this.getSuccessionDuration(data.conversations);
    const topUsersPerConversation = this.getTopUsersPerConversation(
      data.conversations,
    );
    const topConversationsPerDuration = this.getTopConversationsPerDuration(
      data.conversations,
    );
    const averageMessagesPerConversations =
      this.getAverageMessagePerConversation(data.conversations);

    return {
      kpis: {
        ...averages,
        totalConversations,
        successfulCallRate,
        uniqueUserCount,
        shortsConversations,
        averageMessagesPerConversations,
      },
      charts: {
        conversationsPerDay,
        totalTimePerDay,
        distribuitionDuration,
        heatmapHour,
        successionDurate,
      },
      usersStats: {
        topUsersPerConversation,
        topConversationsPerDuration,
      },
      conversations: data.conversations,
    };
  }

  private getAverageMessagePerConversation(conversations: Conversations[]) {
    const totalConversations = conversations.length;

    if (totalConversations === 0) return 0;

    const totalMessages = conversations.reduce((soma, conv) => {
      const count = conv.message_count || 0;
      return soma + count;
    }, 0);

    const average = totalMessages / totalConversations;

    return parseFloat(average.toFixed(1));
  }

  private getAverageMinutesCall(conversations: Conversations[]) {
    if (conversations.length === 0 || conversations.length === 1)
      return { averageMinutes: 0, averageSeconds: 0 };

    const totalSeconds = conversations.reduce(
      (acumulator, item) => acumulator + item.call_duration_secs,
      0,
    );
    const averageSecondsTotal = Math.floor(totalSeconds / conversations.length);
    const averageMinutes = Math.floor(averageSecondsTotal / 60);
    const averageSeconds = Math.floor(averageSecondsTotal % 60);

    return {
      averageMinutes,
      averageSeconds,
    };
  }

  private formatISOToBR(isoDate: string) {
    const [year, month, day] = isoDate.split('-');
    return `${day}/${month}/${year}`;
  }

  private getSuccessfulCallRate(conversations: Conversations[]) {
    const conversationsSuccessful = conversations.filter(
      (item) => item.call_successful === 'success',
    );
    const rateSuccessful = (
      (conversationsSuccessful.length / conversations.length) *
      100
    ).toFixed(2);

    return rateSuccessful;
  }

  private getConversationsPerDay(conversations: Conversations[]) {
    const conversationsPerDay = {};

    for (const conv of conversations) {
      const data = new Date(conv.start_time_unix_secs * 1000);
      const keyDateISO = data.toISOString().slice(0, 10); // AAAA-MM-DD

      if (!conversationsPerDay[keyDateISO]) {
        conversationsPerDay[keyDateISO] = 0;
      }
      conversationsPerDay[keyDateISO]++;
    }

    return Object.keys(conversationsPerDay)
      .sort() // ISO ordena cronologicamente
      .map((isoDate: string) => ({
        data: this.formatISOToBR(isoDate), // dd/mm/aaaa
        conversations: conversationsPerDay[isoDate] as number,
      }));
  }

  private getTotalTimePerDay(conversations: Conversations[]) {
    const durationPerDay = {};

    for (const conv of conversations) {
      const data = new Date(conv.start_time_unix_secs * 1000);
      const dateKeyISO = data.toISOString().slice(0, 10); // AAAA-MM-DD

      if (!durationPerDay[dateKeyISO]) durationPerDay[dateKeyISO] = 0;

      durationPerDay[dateKeyISO] += conv.call_duration_secs;
    }

    return Object.keys(durationPerDay)
      .sort() // ISO ordena cronologicamente
      .map((isoDate) => ({
        data: this.formatISOToBR(isoDate), // dd/mm/aaaa
        totalTimeSeconds: durationPerDay[isoDate] as number,
      }));
  }

  private getDistribuitionDuration(conversations: Conversations[]) {
    const durations = {
      '0-30s': 0,
      '31-60s': 0,
      '1-3min': 0,
      '3-5min': 0,
      '>5min': 0,
    };

    for (const conv of conversations) {
      const duration = conv.call_duration_secs;
      if (duration <= 30) durations['0-30s']++;
      else if (duration <= 60) durations['31-60s']++;
      else if (duration <= 180) durations['1-3min']++;
      else if (duration <= 300) durations['3-5min']++;
      else durations['>5min']++;
    }

    return Object.keys(durations).map((duration) => ({
      duration: duration,
      count: durations[duration] as number,
    }));
  }

  private getHeatmapHour(conversations: Conversations[]) {
    const countHours = {};
    const daysOfWeek = [
      'Domingo',
      'Segunda',
      'Terça',
      'Quarta',
      'Quinta',
      'Sexta',
      'Sábado',
    ];

    for (const conv of conversations) {
      const data = new Date(conv.start_time_unix_secs * 1000);
      const dayIndex = data.getDay();
      const hour = data.getHours();

      const key = `${dayIndex}-${hour}`;

      if (!countHours[key]) countHours[key] = 0;
      countHours[key]++;
    }

    return Object.keys(countHours).map((key) => {
      const [indexDay, hour] = key.split('-');
      return {
        day_week: daysOfWeek[parseInt(indexDay, 10)],
        return: {
          day_week: daysOfWeek[parseInt(indexDay, 10)],
          hour: parseInt(hour, 10),
          count: countHours[key] as number,
        },
      };
    });
  }

  private getUniqueUsers(conversations: Conversations[]) {
    const allUserIds = conversations.map((item) => item.neo_user_id);
    const uniqueUserIds = new Set(allUserIds);
    const uniqueUserCount = uniqueUserIds.size;

    return uniqueUserCount;
  }

  private getShortConversations(conversations: Conversations[]) {
    const totalConversations = conversations.length;

    if (totalConversations === 0) return { count: 0, percentual: 0 };

    const shortsConversations = conversations.filter(
      (conv) => conv.call_duration_secs <= 15,
    );

    const count = shortsConversations.length;
    const percentual = (count / totalConversations) * 100;

    return {
      count: count,
      percentual: parseFloat(percentual.toFixed(2)),
    };
  }

  private getSuccessionDuration(conversations: Conversations[]) {
    const durations = {
      '0-30s': { success: 0, fail: 0 },
      '31-60s': { success: 0, fail: 0 },
      '1-3min': { success: 0, fail: 0 },
      '3-5min': { success: 0, fail: 0 },
      '>5min': { success: 0, fail: 0 },
    };

    for (const conv of conversations) {
      const duration = conv.call_duration_secs;
      let durationTarget = '';

      if (duration <= 30) durationTarget = '0-30s';
      else if (duration <= 60) durationTarget = '31-60s';
      else if (duration <= 180) durationTarget = '1-3min';
      else if (duration <= 300) durationTarget = '3-5min';
      else durationTarget = '>5min';

      if (
        Object.prototype.hasOwnProperty.call(durations, durationTarget) &&
        durations[durationTarget] !== undefined &&
        typeof (durations[durationTarget] as { success: number; fail: number })
          .success === 'number'
      ) {
        if (conv.call_successful === 'success') {
          (durations[durationTarget] as { success: number; fail: number })
            .success++;
        } else if (conv.call_successful === 'fail') {
          (durations[durationTarget] as { success: number; fail: number })
            .fail++;
        }
      }
    }
    return Object.keys(durations).map((duration) => ({
      duration: duration,
      success: durations[duration as keyof typeof durations].success,
      fail: durations[duration as keyof typeof durations].fail,
    }));
  }

  private getTopUsersPerConversation(conversations: Conversations[]) {
    const countPerUser = new Map<string, number>();

    for (const conv of conversations) {
      const userName = conv.User_Name;
      const actualCount = countPerUser.get(userName) || 0;
      countPerUser.set(userName, actualCount + 1);
    }

    const usersArray = Array.from(countPerUser, ([userName, count]) => ({
      userName,
      count,
    }));

    usersArray.sort((a, b) => b.count - a.count); // orderna do maior para o menor

    // Retorna o top 10
    return usersArray;
  }

  private getTopConversationsPerDuration(conversations: Conversations[]) {
    const durationPerUser = new Map<string, number>();

    for (const conv of conversations) {
      const userName = conv.User_Name;
      const actualDuration = durationPerUser.get(userName) || 0;
      durationPerUser.set(userName, actualDuration + conv.call_duration_secs);
    }

    const usersArray = Array.from(durationPerUser, ([userName, duration]) => ({
      userName,
      duration,
    }));

    usersArray.sort((a, b) => b.duration - a.duration);

    return usersArray;
  }
}
