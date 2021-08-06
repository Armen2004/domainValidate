<?php

namespace App\Jobs;

use App\Models\Domain;
use DateTime;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class DomainJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    private $data;

    /**
     * Create a new job instance.
     * @param $data
     * @return void
     */
    public function __construct($data)
    {
        $this->data = $data;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        $date = date('Y-m-d', strtotime($this->data[1]));
        $today = new DateTime('now');
        $domainDate = new DateTime($date);
        $isValid = $this->isValidDomain($this->data[0]) && $this->isDomainNotExpired($today, $domainDate);
        Domain::create([
            'name' => $this->data[0],
            'is_valid' => $isValid,
            'expire_date' => $date,
            'valid_until' => $isValid ? $this->domainValidUntil($today, $domainDate) : ''
        ]);
    }

    /**
     * @param string $domain
     * @return bool
     */
    private function isValidDomain(string $domain): bool
    {
        return preg_match("/^(?!-)[A-Za-z0-9-]+([\\-\\.]{1}[a-z0-9]+)*\\.[A-Za-z]{2,6}$/i", $domain);
    }

    /**
     * @param DateTime $today
     * @param DateTime $domainDate
     * @return bool
     */
    private function isDomainNotExpired(DateTime $today, DateTime $domainDate): bool
    {
        return $domainDate > $today;
    }

    /**
     * @param DateTime $today
     * @param DateTime $domainDate
     * @return string
     */
    private function domainValidUntil(DateTime $today, DateTime $domainDate): string
    {
        $interval = $today->diff($domainDate);
        return $interval->format('%y Year %m Month %d Day %H:%I:%S Hours');
    }
}
