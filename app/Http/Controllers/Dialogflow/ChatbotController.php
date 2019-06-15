<?php
/**
 * Created by PhpStorm.
 * User: fabersoft
 * Date: 10/03/19
 * Time: 19:17
 */

namespace Bufallus\Http\Controllers\Dialogflow;

use Bufallus\Http\Controllers\Controller;
use Google\Cloud\Dialogflow\V2\SessionsClient;
use Google\Cloud\Dialogflow\V2\TextInput;
use Google\Cloud\Dialogflow\V2\QueryInput;


/**
 * Class ChatbotController
 * @package Bufallus\Http\Controllers\Report
 */
class ChatbotController extends Controller
{
    /**
     * Returns the result of detect intent with texts as inputs.
     * Using the same `session_id` between requests allows continuation
     * of the conversation.
     * @throws \Google\ApiCore\ValidationException
     * @throws \Google\ApiCore\ApiException
     */
    function test()
    {
        // new session
        $projectId = 'bufallus-2b7fe';
        $sessionId = request('session_id', uniqid());
        $test = array('credentials' => base_path('client-secret.json'));
        $sessionsClient = new SessionsClient($test);
        $session = $sessionsClient->sessionName($projectId, $sessionId);
        printf('Session path: %s' . PHP_EOL, $session);

        $languageCode = 'pt-BR';

        // create text input
        $textInput = new TextInput();
        $textInput->setText(request('message'));
        $textInput->setLanguageCode($languageCode);

        // create query input
        $queryInput = new QueryInput();
        $queryInput->setText($textInput);

        // get response and relevant info
        $response = $sessionsClient->detectIntent($session, $queryInput);
        $queryResult = $response->getQueryResult();
        $queryText = $queryResult->getQueryText();
        $intent = $queryResult->getIntent();
        $displayName = $intent->getDisplayName();
        $confidence = $queryResult->getIntentDetectionConfidence();
        $fulfilmentText = $queryResult->getFulfillmentText();

        // output relevant info
        print(str_repeat("=", 20) . PHP_EOL);
        printf('Query text: %s' . PHP_EOL, $queryText);
        printf('Detected intent: %s (confidence: %f)' . PHP_EOL, $displayName, $confidence);
        print(PHP_EOL);
        printf('Fulfilment text: %s' . PHP_EOL, $fulfilmentText);

        $sessionsClient->close();
    }
}
